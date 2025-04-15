import { Stack as MuiStack, styled } from '@mui/material';
import { keyframes } from '@mui/system';

const opacity = keyframes`
  from {
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Stack = styled(MuiStack)(() => ({
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	animation: `${opacity} 2s`,
}));
