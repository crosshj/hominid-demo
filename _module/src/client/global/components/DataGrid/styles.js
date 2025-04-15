import { Stack, styled } from '@mui/material';

export const Container = styled(Stack)(({ theme }) => ({
	minHeight: '50vh',

	'& .MuiDataGrid-columnHeaders': {
		background: theme.palette.divider,
		color: theme.palette.text.primary,
		borderRadius: 0,
	},

	'& .MuiDataGrid-columnHeader *': {
		fontWeight: 'bold',
	},
}));
