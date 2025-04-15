import { Fragment } from 'react';
import { useTheme, useMediaQuery, SwipeableDrawer } from '@mui/material';
import { useLayout } from '../../hooks/useLayout';

import * as S from './styles';
import { SidebarContent } from './components/Content/index.jsx';
import { StateManager } from '../../../state/state';

export const Sidebar = ({ menus }: any) => {
	//const [loading] = StateManager.useListener('loading');
	const [activeMenu]: any = StateManager.useListener('menu', undefined, {
		note: 'Sidebar',
		unique: true,
	});

	const {
		open = false,
		handleToggleDrawer = null,
		isScreenMediumOrBelow,
	}: any = useLayout();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up('md'));

	const loading = !(
		typeof menus !== 'undefined' &&
		Array.isArray(menus) &&
		menus.length > 0
	);

	const contentProps = {
		menus,
		open,
		loading,
		handleToggleDrawer,
		activeMenu: activeMenu?.target,
		isScreenMediumOrBelow,
	};

	const SidebarContainer = S.SidebarContainer as any;

	// we don't have to use two different drawers here?
	// use temporary vs permanent, yeh?
	// https://mui.com/material-ui/react-drawer/
	return (
		<>
			{matches ? (
				<SidebarContainer open={open}>
					<SidebarContent {...contentProps} />
				</SidebarContainer>
			) : (
				<Fragment>
					<SwipeableDrawer
						open={open}
						onClose={handleToggleDrawer}
						onOpen={handleToggleDrawer}
					>
						<SidebarContent {...contentProps} />
					</SwipeableDrawer>
				</Fragment>
			)}
		</>
	);
};
