import { CircularProgress, Stack } from '@mui/material';

export const Loading = () => {
	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{ height: '100%' }}
		>
			<CircularProgress color="inherit" />
		</Stack>
	);
};
