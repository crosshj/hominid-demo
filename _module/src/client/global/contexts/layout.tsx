import React, { useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

export const LayoutContext = React.createContext({});

export const LayoutProvider = ({ children }: any) => {
	const theme = useTheme();
	const [open, setOpen] = useState(true);
	const isScreenMediumOrBelow = useMediaQuery(theme.breakpoints.down('md'));

	const handleToggleDrawer = () => {
		setOpen((oldState) => {
			if (!isScreenMediumOrBelow) {
				localStorage.setItem('drawerOpen', !oldState + '');
			}
			return !oldState;
		});
	};
	useEffect(() => {
		if (isScreenMediumOrBelow) return;
		const cachedDrawerState = localStorage.getItem('drawerOpen');
		if (!cachedDrawerState) return;
		const parsedState = JSON.parse(cachedDrawerState);
		setOpen(parsedState);
	}, [isScreenMediumOrBelow]);

	useEffect(() => {
		if (!isScreenMediumOrBelow) return;
		setOpen(false);
	}, [isScreenMediumOrBelow]);

	const value = { open, handleToggleDrawer, isScreenMediumOrBelow };
	return (
		<LayoutContext.Provider value={value}>
			{children}
		</LayoutContext.Provider>
	);
};
