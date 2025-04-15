import { Stack, styled } from '@mui/material';

export const DataGridToolbar = styled(Stack)(({ theme }) => ({
	justifyContent: 'space-between',
	background: theme.palette.divider,
}));
