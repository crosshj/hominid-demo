import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, styled } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		right: -3,
		top: 13,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: '0 4px',
	},
}));

export const NotificationBadge = ({ amountOfNotifications = 0 }: any) => {
	return (
		<StyledBadge badgeContent={amountOfNotifications} color="error">
			<NotificationsIcon />
		</StyledBadge>
	);
};
