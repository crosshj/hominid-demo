import {
	ListItemButton as MuiListItemButton,
	ListItemIcon as MuiListItemIcon,
	ListItemText as MuiListItemText,
	styled,
} from '@mui/material';

export const ListItemButton = styled(MuiListItemButton, {
	shouldForwardProp: (props) => props !== 'isActive',
})(({ theme, isActive }) => ({
	height: theme.spacing(7),
	// color: isActive && theme.palette.primary.main,
	justifyContent: 'center',
	paddingInline: theme.spacing(2),
}));

export const ListItemIcon = styled(MuiListItemIcon, {
	shouldForwardProp: (props) => props !== 'isActive',
})(({ theme, isActive }) => ({
	minWidth: 0,
	// color: isActive && theme.palette.primary.main,
	justifyContent: 'center',
}));

export const ListItemText = styled(MuiListItemText)(({ theme, isActive }) => ({
	marginLeft: theme.spacing(2),
	// color: isActive && theme.palette.primary.main,
}));
