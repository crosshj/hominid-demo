import React from 'react';
import { CircularProgress, Stack } from '@mui/material';
import * as S from './styles';

export const LoadingScreen = ({ show }: any) => {
	if (!show) return null;
	return (
		<S.Container>
			<Stack alignItems="center" data-test-id="loading-screen">
				<CircularProgress color="inherit" />
			</Stack>
		</S.Container>
	);
};
