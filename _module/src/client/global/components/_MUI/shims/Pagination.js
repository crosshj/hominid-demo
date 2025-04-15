import { withRunFlowProps } from '../../../../framework/core/withRunFlowProps';

export const Pagination = ({ propsFilled, propsIntact }) => {
	const propsShimmed = {
		page: propsFilled.page || 0,
		count: propsFilled.count || 0,
	};
	if (propsShimmed.count <= 1) {
		propsShimmed.className = 'hide-empty-pagination';
	}
	const runFlowProps = withRunFlowProps({ propsIntact, propsFilled });

	propsShimmed.onChange = (e, nextPage) => {
		if (typeof runFlowProps.onChange !== 'function') return;
		runFlowProps.onChange({
			name: propsIntact.name,
			nextPage,
			props: propsIntact,
		});
	};
	return { propsShimmed };
};
