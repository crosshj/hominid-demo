import { Stack, Typography } from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import {
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
} from '@mui/icons-material';

import * as S from '../SidebarItem/styles';

export const ToggleColorTheme = ({ open }: any) => {
	const { handleToggleColorTheme, mode }: any = useTheme();

	return (
		<Stack>
			<S.ListItemButton onClick={handleToggleColorTheme}>
				<S.ListItemIcon>
					{mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
				</S.ListItemIcon>
				{open && (
					<S.ListItemText>
						<Typography variant="button">
							{mode === 'dark' ? 'Dark' : 'Light'}{' '}
						</Typography>
					</S.ListItemText>
				)}
			</S.ListItemButton>
		</Stack>
	);
};
