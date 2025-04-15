import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useApi } from './hooks/useApi';
import { useUser } from './hooks/useUser';
import { MainLayout } from './layouts/MainLayout';
import { LoadingScreen, WelcomeScreen, WelcomeError } from './screens';
import { GlobalProvider, LayoutProvider, UserProvider } from './contexts';
import { useEffect, useMemo } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Framework } from '../framework';

import { getMenus } from './services/getMenus';
import { SnakeCase } from './utils';
import { parseProperties } from './utils/parseProperties';
import { StateManager } from '../state/state';
import { getContext } from './services/getContext';

import getContextQuery from './graphql/getContext.gql';
import getListViewQuery from './graphql/getListView.gql';
import { CustomPage } from './screens/CustomPage';

const graphqlActions = {
	//getLayout: loader('./graphql/getMenus.gql'),
	getContext: getContextQuery,
	getListView: getListViewQuery,
};

const getIconFromProps = (props = '') => {
	let { icon = 'ArrowForwardIos' } = parseProperties(props) || {};
	return SnakeCase(icon);
};

const updateContext = ({ target = '', param = '' } = {}) => {
	getContext({
		setUIContext: (v: any) => StateManager.update('UIContext', v),
		key: target,
		param,
	});
};

const menuMap = (x: any, i: any) => ({
	menu_id: i,
	menu_name:
		{
			Page: 'left-nav',
			LinkMenu: 'top-hamburger',
		}[x.type as string] || 'left-nav',
	menu_item_id: i,
	menu_item_name: x.label,
	item_order: x.order,
	TargetContentName: x.key,
	icon: getIconFromProps(x?.properties),
});

const GlobalNoUser = ({ customComponents, page }: any) => {
	const [state, setState]: any = StateManager.useListener(
		undefined,
		undefined,
		{
			note: '<GlobalNoUser /> (global/index.tsx)',
		},
	);
	const api = useApi({
		queryList: graphqlActions,
		setState,
	});
	const globalModule = useMemo(
		() => ({ state, setState, api }),
		[state, setState, api],
	);
	return (
		<>
			<LoadingScreen show={state.isLoading} />
			<LayoutProvider>
				<GlobalProvider
					{...globalModule}
					customComponents={customComponents}
				>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<CustomPage {...page} />
					</LocalizationProvider>
				</GlobalProvider>
			</LayoutProvider>
		</>
	);
};

const GlobalWithUser = ({ customComponents }: any) => {
	// ? why do we need UserContext? we can provide the user as param to <GlobalWithUser /> on App.tsx
	const { user, isLoading }: any = useUser();

	// ? why do we need to listen to a undefined state?
	// ? is it to know when State is initialized? well, we can do that on App.tsx.
	// ? if is because setState, we can use StateManager directly on hooks, why not?
	const [state, setState]: any = StateManager.useListener(
		undefined,
		undefined,
		{
			note: '<GlobalWithUser /> (global/index.tsx)',
		},
	);

	const [menus]: any = StateManager.useListener('menus', undefined, {
		note: '<GlobalWithUser /> (global/index.tsx)',
	});

	StateManager.subscribe('menu', updateContext, {
		note: '<GlobalWithUser /> (global/index.tsx)',
		unique: true,
	});

	useEffect(() => {
		if (!user) return;
		if (!state?.menu) return;
		updateContext(state.menu);
	}, [user, state.menu]);

	const api = useApi({
		queryList: graphqlActions,
		setState,
	});

	const globalModule = useMemo(
		() => ({ state, setState, api }),
		[state, setState, api],
	);

	// ? why not this? maybe dont even need useMemo here
	// const api = useMemo(
	// 	() =>
	// 		useApi({
	// 			queryList: graphqlActions,
	// 			setState,
	// 		}),
	// 	[setState],
	// );

	useEffect(() => {
		if (!user) return;
		if (menus?.length) return;
		getMenus({ menuMap } as any);
	}, [user, menus]);

	if (user?.error) {
		return <WelcomeError error={user.error} />;
	}

	return (
		<>
			<LoadingScreen show={isLoading} />
			<LayoutProvider>
				{user ? (
					<GlobalProvider
						{...globalModule}
						customComponents={customComponents}
					>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<LoadingScreen show={!menus || !menus.length} />
							<MainLayout menus={menus}>
								<Framework />
								<ToastContainer
									position="bottom-right"
									autoClose={4000}
									theme="colored"
								/>
							</MainLayout>
						</LocalizationProvider>
					</GlobalProvider>
				) : (
					<WelcomeScreen />
				)}
			</LayoutProvider>
		</>
	);
};

export const Global = ({ customComponents, page }: any) => {
	if (page?.title) {
		document.title = page.title;
	}
	if (page.authorized === false) {
		return <GlobalNoUser {...{ customComponents, page }} />;
	}
	return (
		<UserProvider>
			<GlobalWithUser {...{ customComponents }} />
		</UserProvider>
	);
};
