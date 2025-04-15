import { Spacing } from '../components/Spacing';

export const spacingAdapter = ({ props }) => {
	const { space } = props || {};

	return { space, Component: Spacing };
};
