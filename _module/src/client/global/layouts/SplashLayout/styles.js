import { Stack } from '@mui/material';
import { styled } from '@mui/system';

export const SplashScreen = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	height: '100vh',
	width: '100vw',
	background: `linear-gradient(${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
	position: 'fixed',
	top: '0',
}));
