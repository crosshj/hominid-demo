import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Divider, Menu } from '@mui/material';
import * as M from '@mui/material';
import {
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
} from '@mui/icons-material';

import { useUser } from '../../hooks/useUser';
import { useTheme } from '../../hooks/useTheme';
import { Link } from '../../../router';
import { useGlobal } from '../../hooks/useGlobal';

const menuIconStyle = {
	justifyContent: 'center',
	minWidth: 0,
	marginRight: '1em',
};

const FeedbackMenuItem = ({ onClick }: any) => {
	const handleClick = () => {
		(window as any)?.showUserSnap && (window as any).showUserSnap();
		onClick && onClick();
	};
	return (
		<M.ListItemButton onClick={handleClick}>
			<M.ListItemIcon style={menuIconStyle}>
				<M.Icon>lightbulb</M.Icon>
			</M.ListItemIcon>
			<M.ListItemText>
				<M.Typography>Feedback</M.Typography>
			</M.ListItemText>
		</M.ListItemButton>
	);
};
const LogoutMenuItem = () => {
	return (
		<Link href="/api/auth/logout">
			<M.ListItemButton>
				<M.ListItemIcon style={menuIconStyle}>
					<M.Icon>logout</M.Icon>
				</M.ListItemIcon>
				<M.ListItemText>
					<M.Typography>Logout</M.Typography>
				</M.ListItemText>
			</M.ListItemButton>
		</Link>
	);
};
const SettingsMenuItem = ({ onClick, dispatch }: any) => {
	const handleClick = () => {
		onClick && onClick();
		dispatch({ type: 'navigate', target: 'settings' });
	};
	return (
		<M.ListItemButton onClick={handleClick}>
			<M.ListItemIcon style={menuIconStyle}>
				<M.Icon>settings</M.Icon>
			</M.ListItemIcon>
			<M.ListItemText>
				<M.Typography>Settings</M.Typography>
			</M.ListItemText>
		</M.ListItemButton>
	);
};
const ToggleColorTheme = ({ onClick }: any) => {
	const { handleToggleColorTheme, mode }: any = useTheme();
	const handleClick = () => {
		onClick && onClick();
		handleToggleColorTheme();
	};
	return (
		<M.ListItemButton onClick={handleClick}>
			<M.ListItemIcon style={menuIconStyle}>
				{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
			</M.ListItemIcon>
			<M.ListItemText>
				<M.Typography>
					{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
				</M.Typography>
			</M.ListItemText>
		</M.ListItemButton>
	);
};

export const Profile = () => {
	const { dispatch }: any = useGlobal();
	const { user, isLoading }: any = useUser();
	const [anchor, setAnchor] = useState(null);

	const handleClick = (e: any) => {
		setAnchor(e.target);
	};
	const handleClose = () => {
		setAnchor(null);
	};
	if (isLoading) return <CircularProgress />;

	return (
		<>
			<Avatar
				alt={user.name}
				src={user.picture}
				onClick={handleClick}
				sx={{ cursor: 'pointer' }}
			/>
			<Menu
				open={Boolean(anchor)}
				anchorEl={anchor}
				onClose={handleClose}
				transitionDuration={{ exit: 0 }}
			>
				<ToggleColorTheme onClick={handleClose} />
				<FeedbackMenuItem onClick={handleClose} />
				<SettingsMenuItem onClick={handleClose} dispatch={dispatch} />
				<Divider />
				<LogoutMenuItem />
			</Menu>
		</>
	);
};
