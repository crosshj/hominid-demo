import _ from 'lodash';

import { StateManager } from '../../state/state';

import {
	parseProperties,
	withNamespaced,
} from '../../global/utils/parseProperties';

import { getShim } from '../../global/components/_MUI/shims';
import { fill, getStatefulProps } from '../../global/components/_MUI/core';
import { parseProps } from './parseProps';
import { withRunFlowProps } from './withRunFlowProps';
import { useTheme } from '../../global/hooks/useTheme';

type AnyComponent = (...props: any) => JSX.Element | JSX.Element[] | null;

export const withStateful =
	(Component: AnyComponent, _shimName?: string) =>
	({ sx = '', children, ...propsIntactSrc }: any) => {
		const theme = useTheme() as any;
		const additionalProps = parseProps(propsIntactSrc._src);

		const propsIntact = Object.assign(propsIntactSrc, additionalProps);

		// 1. get stateful props (props that rely on global state or other values)
		const statefulProps = getStatefulProps(propsIntact, 'fillOwn');

		const pathsToListen = _.uniq(
			_.flatMap(statefulProps, (x) => x.pathsToListen),
		);

		if (
			propsIntact.useData &&
			!pathsToListen.includes(propsIntact.useData)
		) {
			pathsToListen.push(propsIntact.useData);
		}

		// 2. listen to stateful paths (stateful props + "useData" prop, which is a special case)
		StateManager.useListener(pathsToListen, undefined, {
			note: 'with-tokens-and-data-' + pathsToListen.join(','),
		});

		// 3. fill stateful props by actual values
		// returns only STATEFUL PROPS
		const propsFilled = fill(propsIntact, statefulProps, { theme });

		// 4. get shim (improvements for Component)
		const shimName = _shimName || (Component as any)._name;
		const { propsShimmed, childrenShimmed } = getShim(
			shimName,
			propsIntact,
			propsFilled,
		);

		if (!_.isUndefined(childrenShimmed)) {
			children = childrenShimmed;
		}

		/// 4.1 runFlow_ props
		const propsRunFlow = withRunFlowProps({ propsIntact, propsFilled });

		// 5. finally mount props
		const allProps = withNamespaced({
			...propsIntact,
			...propsFilled,
			...propsRunFlow,

			inputProps: parseProperties(propsIntact.inputProps),
			// props shimmed must come after stateful props filled
			// because it can overwrite some props
			...propsShimmed,

			// these props should not be overrided.
			// TODO: shims for Button contain "sx" props -- does it work correctly?
			sx: parseProperties(sx),
			type: propsIntact?._src?.type,
		});

		const { textContent }: any = allProps;

		// this prop messes up css FLEX order
		delete (allProps as any).order;

		delete (allProps as any).__rowStateKey;
		delete (allProps as any).__rowIndex;
		delete (allProps as any).__rowTotals;
		delete (allProps as any).textContent;
		delete (allProps as any).inputProps;

		if (propsIntact.debug) {
			console.log({
				_: `withStateful DEBUG - ${propsIntact?._src?.type}`,
				sx,
				propsIntact,
				propsFilled,
				propsShimmed,
				propsRunFlow,
				pathsToListen,
				allProps,
			});
		}

		// 6. render
		return (
			<Component {...allProps}>
				{textContent ? textContent : null}
				{children ? children : null}
			</Component>
		);
	};
