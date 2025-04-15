import { styled } from '@mui/material';
import { SplashScreen } from '../../layouts';

export const Container = styled(SplashScreen)(({ theme }) => ({
	color: theme.palette.background.paper,
	position: 'absolute',
	top: '0',
	left: '0',
	zIndex: '9999',
}));
