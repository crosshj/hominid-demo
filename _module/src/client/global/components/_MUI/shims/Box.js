export const Box = ({ propsFilled, propsIntact }) => {
	const shim = {};

	if (
		propsIntact?.renderChildren &&
		propsFilled?.renderChildren + '' !== 'true'
	) {
		shim.childrenShimmed = [];
	}

	return shim;
};
