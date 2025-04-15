import _ from 'lodash';

import 'urlpattern-polyfill';

import './App.css';
import './css/utility.css';

import './global/utils/warningsAreNotErrors';

import CssBaseline from '@mui/material/CssBaseline';
import { Global } from './global';
import { Routes } from './global/contexts/global/routes';
import { ThemeProvider } from './global/contexts';

import { StateManager } from './state/state';
import { FlowPollManager } from './state/flow';
import { withStateful } from './framework/core/withStateful';
import { useEffect } from 'react';

const initialState = {
	_module: {
		version: '[VI]{version}[/VI]',
		date: '[VI]{date}[/VI]',
	},
	version: 0,
	menus: [],
	menu: Routes(),
	urlOrigin: window.location.origin,
	previousMenu: { target: 'root.dashboard', param: '' },
};
StateManager.init(initialState);
FlowPollManager.init({ logLevel: 'error', queue: [] });

export default function App(args: any) {
	const { theme, components = {}, page = {}, rolesMap = {} } = args;

	useEffect(() => {
		StateManager.update('rolesMap', rolesMap);
	}, [rolesMap]);

	const customComponents = _.transform(
		components,
		(acc, compCallback, key) => {
			_.set(acc, key, withStateful(compCallback));
			return acc;
		},
		{},
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Global {...{ customComponents, page }} />
		</ThemeProvider>
	);
}
