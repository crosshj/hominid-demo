import { Typography, useMediaQuery, useTheme } from '@mui/material';
import * as M from '@mui/material';
import * as S from './styles';
import { Link } from '../../../router';

export const SidebarItem = ({
	item,
	open,
	handleToggleDrawer,
	isActive,
	disabled,
}: any) => {
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	const ListItemButton = S.ListItemButton as any;
	const ListItemIcon = S.ListItemIcon as any;

	return (
		<Link to={item?.TargetContentName}>
			<ListItemButton
				isActive={isActive}
				selected={isActive}
				disabled={disabled}
				onClick={matches ? handleToggleDrawer : null}
			>
				<ListItemIcon isActive={isActive}>
					<M.Icon>{item.icon}</M.Icon>
				</ListItemIcon>

				{open && (
					<S.ListItemText>
						<Typography>{item?.menu_item_name}</Typography>
					</S.ListItemText>
				)}
			</ListItemButton>
		</Link>
	);
};
