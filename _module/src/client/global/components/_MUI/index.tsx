import _ from 'lodash';
import * as M from '@mui/material';
import { StateManager } from '../../../state/state';

import { getShim } from './shims';
import * as StandardComponents from './StandardComponents';
import { fill, getStatefulProps } from './core';
import { genericAdapter } from '../../adapters/generic';
import { parseProperties, withNamespaced } from '../../utils/parseProperties';
import { useTheme } from '../../hooks/useTheme';

/*
 * PROPS NAMING
 *
 * "propsIntact" => original props, without any replacing or filling, the same way
 * as they come originally from .xml files/config/fragments.
 *
 * "propsFiled" => props replaced/filled with values from state or alternative data sources, such as row data.
 */

const ComponentWithTokensAndData = ({
	sx = '',
	children,
	component: Component,
	...propsIntact
}: any) => {
	const theme = useTheme() as any;

	// 1. get stateful props (props that rely on global state or other values)
	const statefulProps = getStatefulProps(propsIntact, 'fillOwn');

	const pathsToListen = _.flatMap(statefulProps, (x) => x.pathsToListen);

	if (propsIntact.useData && !pathsToListen.includes(propsIntact.useData)) {
		pathsToListen.push(propsIntact.useData);
	}

	// 2. listen to stateful paths (stateful props + "useData" prop, which is a special case)
	if (pathsToListen.length) {
		StateManager.useListener(pathsToListen, undefined, {
			note: 'with-tokens-and-data-' + pathsToListen.join(','),
		});
	}

	// 3. fill stateful props by actual values
	// returns only STATEFUL PROPS
	const propsFilled = fill(propsIntact, statefulProps, { theme });

	// 4. get shim (improvements for Component)
	// let shim = {};
	const { propsShimmed = {}, childrenShimmed } = getShim(
		Component._name,
		propsIntact,
		propsFilled,
	);

	if (!_.isUndefined(childrenShimmed)) {
		children = childrenShimmed;
	}

	// 5. finally mount props
	const allProps = withNamespaced({
		...propsIntact,
		...propsFilled,

		inputProps: parseProperties(propsIntact.inputProps),
		// props shimmed must come after stateful props filled
		// because it can overwrite some props
		...propsShimmed,

		// these props should not be overrided.
		// TODO: shims for Button contain "sx" props -- does it work correctly?
		sx: parseProperties(sx),
		type:
			typeof propsShimmed.type === 'undefined'
				? propsIntact?._src?.type
				: propsShimmed.type,
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
			_: `_MUI DEBUG - ${Component._name}`,
			sx,
			propsIntact,
			propsFilled,
			propsShimmed,
			childrenShimmed,
			statefulProps,
			pathsToListen,
			allProps,
			children,
		});
		console.log('\n');
	}

	const isValidTextContent = textContent != null && textContent !== '';
	// 6. render
	return (
		<Component {...allProps}>
			{isValidTextContent ? textContent : null}
			{children ? children : null}
		</Component>
	);
};

const Generic = (name: any) => (props: any) => {
	const Component = (StandardComponents as any)[name] || (M as any)[name];

	_.set(Component, '_name', name);

	return <ComponentWithTokensAndData component={Component} {...props} />;
};

const MUIComponents = {
	Autocomplete: Generic('Autocomplete'),
	Box: Generic('Box'),
	Button: Generic('Button'),
	Container: Generic('Container'),
	Checkbox: Generic('Checkbox'),
	Chip: Generic('Chip'),
	Divider: Generic('Divider'),
	IconButton: Generic('IconButton'),
	Link: Generic('Link'),
	Pagination: Generic('Pagination'),
	Radio: Generic('Radio'),
	Stack: Generic('Stack'),
	Switch: Generic('Switch'),
	TextField: Generic('TextField'),
	Typography: Generic('Typography'),
	MUI_Stepper: Generic('Stepper'),
	MUI_MenuItem: Generic('MenuItem'),
	Signature: Generic('Signature'),
};

const MUILike = {
	Map: Generic('Map'),
	SidebarContent: Generic('SidebarContent'),
	UserRolesTabs: Generic('UserRolesTabs'),
};

// const adapters = Object.entries(MUIComponents).reduce(
// 	(a, [k, v]) => ({
// 		...a,
// 		[k]: genericAdapter(v),
// 	}),
// 	{},
// );

const adapters = {
	Autocomplete: genericAdapter(MUIComponents.Autocomplete),
	Box: genericAdapter(MUIComponents.Box),
	Button: genericAdapter(MUIComponents.Button),
	Container: genericAdapter(MUIComponents.Container),
	Checkbox: genericAdapter(MUIComponents.Checkbox),
	Chip: genericAdapter(MUIComponents.Chip),
	Divider: genericAdapter(MUIComponents.Divider),
	IconButton: genericAdapter(MUIComponents.IconButton),
	Link: genericAdapter(MUIComponents.Link),
	Pagination: genericAdapter(MUIComponents.Pagination),
	Radio: genericAdapter(MUIComponents.Radio),
	Stack: genericAdapter(MUIComponents.Stack),
	Switch: genericAdapter(MUIComponents.Switch),
	TextField: genericAdapter(MUIComponents.TextField),
	Typography: genericAdapter(MUIComponents.Typography),
	MUI_Stepper: genericAdapter(MUIComponents.MUI_Stepper),
	MUI_MenuItem: genericAdapter(MUIComponents.MUI_MenuItem),
	Signature: genericAdapter(MUIComponents.Signature),
	//muilike
	Map: genericAdapter(MUILike.Map),
	SidebarContent: genericAdapter(MUILike.SidebarContent),
	UserRolesTabs: genericAdapter(MUILike.UserRolesTabs),
};

export const components = MUIComponents;

export default adapters;
