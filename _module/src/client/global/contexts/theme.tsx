import React from 'react';
import {
	ThemeProvider as MuiThemeProvider,
	responsiveFontSizes,
	useMediaQuery,
} from '@mui/material';
import * as MUIColors from '@mui/material/colors';

import { createTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { StateManager } from '../../state/state';

export const ThemeContext = React.createContext({});

const withMUIColors = (theme: any) => {
	theme.palette = {
		...theme.palette,
		...MUIColors,
	};
	return theme;
};

export const ThemeProvider = (args: any) => {
	const [uiContext]: any = StateManager.useListener('UIContext', '', {
		unique: true,
		note: `ThemeProvider:UIContext`,
	});
	const [mode]: any = StateManager.useListener('theme', 'light');
	const { children, theme: themeFromConfig } = args || {};
	const prefersDarkMode = useMediaQuery('prefers-color-scheme: dark');

	const handleToggleColorTheme = () => {
		const oldState = localStorage.getItem('colorMode');
		const newMode = oldState === 'dark' ? 'light' : 'dark';
		localStorage.setItem('colorMode', newMode);
		StateManager.update('theme', newMode);
	};

	let theme = createTheme();
	const { logo, ...themeSrc } = themeFromConfig(mode, theme);
	theme = createTheme(themeSrc);
	theme = responsiveFontSizes(theme);
	theme = withMUIColors(theme);

	useEffect(() => {
		const savedColorMode = localStorage.getItem('colorMode');
		if (savedColorMode && savedColorMode !== 'undefined') {
			StateManager.update('theme', savedColorMode);
			return;
		}
		StateManager.update('theme', prefersDarkMode ? 'dark' : 'light');
	}, [prefersDarkMode, uiContext]);

	const value = {
		handleToggleColorTheme,
		logo,
		mode,
		...theme,
	};

	return (
		<ThemeContext.Provider value={value}>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

// export const ThemeProvider = (args: any) => {
// 	const [uiContext]: any = StateManager.useListener('UIContext', '');
// 	const [stateTheme]: any = StateManager.useListener('theme', '');
// 	const { children, theme: _theme } = args || {};
// 	const [mode, setMode] = useState('light');

// 	//TODO: what if theme is not provided or has no mode matching "mode"?
// 	let theme = createTheme();
// 	const { logo, ...themeSrc } = _theme(mode, theme);
// 	theme = createTheme(themeSrc);

// 	const handleToggleColorTheme = () => {
// 		setMode((oldState) => {
// 			const newMode = oldState === 'light' ? 'dark' : 'light';
// 			localStorage.setItem('colorMode', newMode);
// 			return newMode;
// 		});
// 	};
// 	const prefersDarkMode = useMediaQuery('prefers-color-scheme: dark');

// 	useEffect(() => {
// 		if (stateTheme === mode) return;
// 		if (stateTheme) {
// 			setMode(stateTheme);
// 			return;
// 		}
// 		const savedColorMode = localStorage.getItem('colorMode');
// 		if (savedColorMode && savedColorMode !== 'undefined') {
// 			setMode(savedColorMode);
// 			return;
// 		}
// 		setMode(prefersDarkMode ? 'dark' : 'light');
// 	}, [prefersDarkMode, stateTheme]);

// 	useEffect(() => {
// 		StateManager.update('theme');
// 	}, [uiContext, mode]);

// 	const value = {
// 		handleToggleColorTheme,
// 		logo,
// 		mode,
// 		...theme,
// 	};

// 	return (
// 		<ThemeContext.Provider value={value}>
// 			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
// 		</ThemeContext.Provider>
// 	);
// };
