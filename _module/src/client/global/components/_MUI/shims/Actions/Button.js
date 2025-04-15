import _ from 'lodash';

import { runFlow } from '../../core/runFlow';
import { getUseDataProp, maybeUseData } from '../useDataUtils';

export const Button = ({ propsFilled, propsIntact }) => {
	const {
		__rowIndex,
		__rowStateKey,

		type,
		actionType = 'navigate',
		target,
		redirect,
		param: localParam,
	} = propsIntact;

	const _href = propsFilled.href || propsIntact.href || '';

	const propsShimmed = {
		disableElevation: ['true', '1', 'disableElevation'].includes(
			_.get(propsIntact, 'disableElevation', false) + '',
		),
	};

	propsShimmed.onClickShimmed = (e, { dispatch, globalParam }) => {
		e.stopPropagation && e.stopPropagation();
		e.preventDefault && e.preventDefault();

		maybeUseData({ propsIntact });

		const flowHasRun = runFlow({ propsFilled, propsIntact });
		if (flowHasRun) {
			return;
		}

		if (_href) {
			dispatch({
				type: 'navigate',
				href: _href,
				target: propsIntact.target,
			});
			return;
		}

		let param = localParam || globalParam;

		dispatch({ type: actionType || type, target, param, redirect });
	};

	return { propsShimmed };
};
