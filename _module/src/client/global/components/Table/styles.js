import { styled, TableRow } from '@mui/material';

export const SpecialRow = styled(TableRow)(({ theme, color }) => {
	const [colorName, variant] = color.split('.');
	return {
		backgroundColor: theme.palette[colorName][variant],
		'& td': {
			color: theme.palette.background.paper,
			lineHeight: 'unset',
		},
	};
});
