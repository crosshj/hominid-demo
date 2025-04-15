import { LinearProgress } from '@mui/material';
import { Logo } from '../Logo';
import { Stack } from './style';

export const ScreenLoader = () => {
	return (
		<Stack>
			<Logo />
			<LinearProgress sx={{ width: '200px' }} />
		</Stack>
	);
};
