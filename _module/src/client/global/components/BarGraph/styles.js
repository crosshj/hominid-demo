import { Stack, styled } from '@mui/material';

export const BarGraphCard = styled(Stack)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	marginTop: theme.spacing(2),
	height: theme.spacing(10),
	overflow: 'hidden',

	[theme.breakpoints.down('md')]: {
		height: 'auto',
	},
}));
