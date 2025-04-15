import { Box, useTheme } from '@mui/material';

export const Spacing = ({ space }: any) => {
	const theme = useTheme();
	return <Box sx={{ my: `${theme.spacing(space)} !important` }} />;
};
