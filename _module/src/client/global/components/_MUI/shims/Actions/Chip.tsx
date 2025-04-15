import _ from 'lodash';

import { runFlow } from '../../core/runFlow';
import { maybeUseData } from '../useDataUtils';

export const Chip = ({ propsIntact, propsFilled }: any) => {
	const propsShimmed = {
		onClickShimmed: (..._props: any) => {},
	};

	propsShimmed.onClickShimmed = (e, { dispatch }) => {
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

	return { propsShimmed };
};
