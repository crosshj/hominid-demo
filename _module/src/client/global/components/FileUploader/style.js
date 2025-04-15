import { Stack, styled, Typography } from '@mui/material';

export const FileStack = styled(Stack)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	background: 'none',
	width: '100%',
	padding: theme.spacing(3),
	border: '2px dashed #cdcdcd',
	cursor: 'pointer',
}));

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

export const StackIcon = styled(Stack)(({ theme }) => ({
	color: theme.palette.error.main,
	cursor: 'pointer',
	fontSize: theme.typography.body2,
	marginTop: theme.spacing(1),
	verticalAlign: 'middle',
}));
