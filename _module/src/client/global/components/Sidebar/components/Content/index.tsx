import { List } from '@mui/material';
import { SidebarItem } from '../../../SidebarItem';
import { MenuToggleControl } from './MenuToggleControl';

export const SidebarContent = ({
	menus,
	open,
	loading,
	handleToggleDrawer,
	activeMenu,
	isScreenMediumOrBelow,
}: any) => {
	return (
		<List
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				paddingBottom: '0.25em',
			}}
		>
			{menus?.map((menu: any, _index: any) => {
				const isActive =
					menu?.TargetContentName &&
					(activeMenu?.startsWith(menu?.TargetContentName) ||
						('root.' + activeMenu).startsWith(
							menu?.TargetContentName,
						));
				return (
					<SidebarItem
						item={menu}
						open={open}
						disabled={loading}
						handleToggleDrawer={handleToggleDrawer}
						key={`${menu?.TargetContentName}-${menu?.menu_item_id}`}
						isActive={isActive}
						selected={isActive}
					/>
				);
			})}
			{!isScreenMediumOrBelow && (
				<MenuToggleControl {...{ open, handleToggleDrawer }} />
			)}
		</List>
	);
};
