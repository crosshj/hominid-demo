import { Box, styled } from '@mui/material';

export const MobileProfile = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(1),
	marginBottom: theme.spacing(4),

	[theme.breakpoints.up('sm')]: {
		width: '70%',
		left: 0,
		marginLeft: 0,
	},
	[theme.breakpoints.up('md')]: {
		width: '50%',
		left: 0,
		marginLeft: 0,
	},
	[theme.breakpoints.up('lg')]: {
		width: '20%',
		left: 0,
		marginLeft: 0,
	},
}));
