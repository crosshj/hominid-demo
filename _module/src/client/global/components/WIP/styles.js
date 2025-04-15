import { Stack, styled, Typography } from '@mui/material';

export const WIP = styled(Stack)(({ theme }) => ({
	width: '100%',
	height: '100%',
	fill: theme.palette.grey[400],
	alignItems: 'center',
	justifyContent: 'center',
	'> svg': {
		width: '50%',
		maxWidth: '10rem',
		// stroke: theme.palette.primary.main,
		// strokeWidth: '1rem',
	},
}));

export const Title = styled(Typography)(({ theme }) => ({
	textTransform: 'capitalize',
}));
