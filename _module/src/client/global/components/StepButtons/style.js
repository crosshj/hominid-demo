import { Stack, styled, Typography } from '@mui/material';

export const ActionStack = styled(Stack)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-between',
	width: '100%',
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2),
}));

export const Title = styled(Typography)(({ theme }) => ({
	color: theme.palette.primary.main,
	cursor: 'pointer',
	fontWeight: 'bold',
}));
