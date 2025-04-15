import { Stack, styled } from '@mui/material';

export const BarGraphItem = styled(Stack)(({ theme, color, width }) => {
	const colorMap = {
		primary: theme.palette.primary.dark,
		secondary: theme.palette.secondary.main,
		success: theme.palette.success.main,
		warning: theme.palette.warning.main,
		error: theme.palette.error.main,
		info: theme.palette.info.dark,
		warningDark: theme.palette.warning.dark,
		default: theme.palette.grey[400],
		grey1: theme.palette.grey[900],
		grey2: theme.palette.grey[700],
		grey3: theme.palette.grey[500],
		grey4: theme.palette.grey[300],
		grey5: theme.palette.grey[100],
		green1: '#3F8D55',
		green2: '#1E3605',
		green3: '#4D7721',
		green4: '#2E5308',
	};

	return {
		height: '100%',
		width,
		paddingLeft: theme.spacing(1),
		alignItems: 'flex-start',
		justifyContent: 'center',
		color: theme.palette.background.paper,
		backgroundColor: colorMap[color],
	};
});
