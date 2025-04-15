import { styled, Toolbar as MuiToolbar, Stack } from '@mui/material';

export const Toolbar = styled(MuiToolbar)(({ theme }) => ({
	backgroundColor: theme.palette.primary.navbar,
	color: theme.palette.background.paper,
	display: 'flex',
	height: '100%',
	//borderBottom: `1px solid ${theme.palette.divider}`,
	borderBottom: 0,
	justifyContent: 'space-between',
}));

export const HamburgerContainer = styled(Stack)(({ theme }) => ({
	alignItems: 'start',
}));

export const LogoContainer = styled(Stack)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
}));

export const ProfileContainer = styled(Stack)(({ theme }) => ({
	flex: 1,
	flexDirection: 'row',
	gap: '10px',
	justifyContent: 'flex-end',
	alignItems: 'center',
}));
