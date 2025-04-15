import { Stack } from '@mui/material';
import { styled } from '@mui/system';
import { FrameworkFromContext } from '../../framework';
import { StateManager } from '../../state/state';
import { useEffect } from 'react';
import { getContext } from '../services';

export const SplashScreen = styled(Stack)((args) => {
	const { theme } = args;
	return {
		backgroundColor: theme.palette.primary.main,
		height: '100vh',
		width: '100vw',
		background: [
			`linear-gradient(${theme.palette.splash.bg.light} 0%`,
			`${theme.palette.splash.bg.dark} 100%)`,
		].join(', '),
		position: 'fixed',
		top: '0',
	};
});

export const CustomPage = ({ fragment = '' }: any) => {
	const [UIContext = []]: any = StateManager.useListener('UIContext', false, {
		unique: true,
		note: 'CustomPage:UIContext',
	});

	useEffect(() => {
		if (!fragment) return;
		getContext({
			setUIContext: (v: any) => StateManager.update('UIContext', v),
			key: fragment,
			param: '',
		});
	}, [fragment]);

	return (
		<SplashScreen>
			<FrameworkFromContext {...{ UIContext }} />
		</SplashScreen>
	);
};
