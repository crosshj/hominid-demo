import _ from 'lodash';

import { getUseDataProp, maybeUseData } from '../useDataUtils';
import { runFlow } from '../../core/runFlow';

const __getColor = ({ propsFilled, propsIntact }: any) => {
	if (!_.isUndefined(propsFilled?.color)) {
		return propsFilled.color;
	}

	if (!_.isUndefined(propsIntact?.color)) {
		return propsIntact.color;
	}

	return 'default';
};

export const IconButton = ({ propsIntact, propsFilled }: any) => {
	const propsShimmed = {
		label: propsIntact.label,
		target: propsIntact.target,
		value: propsIntact.value,
		color: __getColor({ propsIntact, propsFilled }),
		onClickShimmed: (..._props: any): void => {},
	};

	propsShimmed.onClickShimmed = (e: any, { dispatch }) => {
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();

		maybeUseData({ propsIntact });

		const flowHasRun = runFlow({ propsFilled, propsIntact });
		if (flowHasRun) {
			return;
		}

		const _href = propsFilled.href || propsIntact.href;
		if (_href) {
			dispatch({
				type: 'navigate',
				href: _href,
				target: propsIntact.target,
			});
			return;
		}
	};

	return {
		propsShimmed,
	};
};
