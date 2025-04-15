import { runFlow } from '../../core/runFlow';

export const MenuItem = ({ propsIntact, propsFilled }) => {
	const propsShimmed = {};

	propsShimmed.onClickShimmed = (e, { dispatch }) => {
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();

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
