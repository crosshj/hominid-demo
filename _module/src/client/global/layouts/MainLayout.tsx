import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import ErrorBoundary from '../components/ErrorBoundary';
import { filterMenusByName } from '../utils';
import { StateManager } from '../../state/state';

export const MainLayout = ({ menus, children }: any) => {
	const [uiContext]: any = StateManager.useListener('UIContext', '', {
		unique: true,
		note: `MainLayout:UIContext`,
	});
	const [headerMenus, setHeaderMenus] = useState([]);
	const [sidebarMenus, setSidebarMenus] = useState([]);

	useEffect(() => {
		setHeaderMenus(filterMenusByName(menus, 'top-hamburger'));
		setSidebarMenus(filterMenusByName(menus, 'left-nav'));
	}, [menus]);

	return (
		<Stack id="main-layout" {...{ variant: 'main' }}>
			<Header />
			<Stack className="layout-body" {...{ variant: 'body' }}>
				<Stack {...{ variant: 'sidebar' }}>
					<Sidebar menus={sidebarMenus} />
				</Stack>
				<Stack className="layout-content" {...{ variant: 'content' }}>
					<ErrorBoundary context={uiContext} variant="page">
						{children}
					</ErrorBoundary>
				</Stack>
			</Stack>
		</Stack>
	);
};
