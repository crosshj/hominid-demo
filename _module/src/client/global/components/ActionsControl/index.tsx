import { Stack } from '@mui/material';

export const ActionsControl = ({ children }: any) => {
	return (
		<Stack direction="row" justifyContent="space-between">
			{children}
		</Stack>
	);
};
