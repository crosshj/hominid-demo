import { Stack } from '@mui/system';

export const stepFooterAdapter = ({ type, props }) => {
	return {
		Component: Stack,
		...props,
		direction: 'row',
		justifyContent: 'space-between',
		width: '100%',
		spacing: 2,
		my: 4,
	};
};
