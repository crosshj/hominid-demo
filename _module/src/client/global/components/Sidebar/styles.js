import { Box, styled } from '@mui/material';

export const SidebarContainer = styled(Box)(({ theme, open }) => ({
	width: open ? '240px' : '70px',
	position: 'sticky',
	height: '100%',
	boxShadow: '5px 0px 7px 0px rgba(0,0,0,0.18)',
}));
