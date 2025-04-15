import { Stack, styled } from '@mui/material';

export const ItemsContainer = styled(Stack)(({ theme }) => ({
	width: '100%',
	maxHeight: '450px',
	overflowY: 'scroll',
}));

export const Container = styled(Stack)(({ theme }) => ({
	flexDirection: 'column-reverse',
}));
