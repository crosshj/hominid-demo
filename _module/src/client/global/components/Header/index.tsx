import { Box, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import * as S from './styles';
import { Link } from '../../../router';
import { useLayout } from '../../hooks/useLayout';
import { Logo } from '../Logo';
import { Profile } from '../Profile';

import { NotificationComponent } from '../Notifications';

export const Header = () => {
	const { isScreenMediumOrBelow, handleToggleDrawer = null }: any =
		useLayout() || {};

	return (
		<Box sx={{ height: '70px' }}>
			<S.Toolbar>
				{isScreenMediumOrBelow && (
					<S.HamburgerContainer>
						<IconButton
							size="large"
							edge="start"
							aria-label="open drawer"
							onClick={handleToggleDrawer}
							sx={{ color: 'white' }}
						>
							<Menu />
						</IconButton>
					</S.HamburgerContainer>
				)}
				<S.LogoContainer>
					<Link to="/home">
						<Box sx={{ width: '100%', height: '100%' }}>
							<Logo variant="single" color1="white" hasTag />
						</Box>
					</Link>
				</S.LogoContainer>
				<S.ProfileContainer>
					<NotificationComponent />
					<Profile />
				</S.ProfileContainer>
			</S.Toolbar>
		</Box>
	);
};
