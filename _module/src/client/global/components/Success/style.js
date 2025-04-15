import { Stack, styled, Button as MuiButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';

export const SuccessStack = styled(Stack)(({ theme }) => ({
	fontSize: theme.typography.body1,
	marginTop: theme.spacing(4),
	marginBottom: theme.spacing(3),
	width: '100%',
}));

export const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
	color: theme.palette.success.main,
	marginBottom: theme.spacing(2),
}));

export const ErrorIcon = styled(Cancel)(({ theme }) => ({
	color: theme.palette.error.main,
	marginBottom: theme.spacing(2),
}));

export const Button = styled(MuiButton)(({ theme }) => ({
	marginTop: theme.spacing(3),
}));
