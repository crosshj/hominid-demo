import { Box, Button, Chip, styled, Typography } from '@mui/material';

export const TimeDisplayer = styled(Typography)(({ theme }) => ({
	fontSize: '2rem',
	fontWeight: '300',

	[theme.breakpoints.down('lg')]: {
		fontSize: '2rem !important',
	},
}));

export const TimeLabel = styled(Typography)(({ theme }) => ({
	fontSize: '1.125rem',
	fontWeight: '400',

	[theme.breakpoints.down('lg')]: {
		fontSize: '1rem !important',
	},
}));
