import {
	ToggleButton,
	ToggleButtonGroup as MuiToggleButtonGroup,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { StateManager } from '../../../state/state';
import { useGlobal } from '../../hooks/useGlobal';
import { useMount } from '../../hooks/useMount';

export const ToggleButtonGroup = ({ options, defaultTargetQuery }: any) => {
	const [selectedListView]: any =
		StateManager.useListener('selectedListView');
	const [loading]: any = StateManager.useListener('loading');
	const { dispatch }: any = useGlobal();

	const handleChange = (_e: any, target: any) => {
		if (!target) return;
		dispatch({ type: 'selectListView', target });
	};
	useMount(() => {
		dispatch({ type: 'selectListView', target: defaultTargetQuery });
	});

	const theme = useTheme();
	const matchesBigScreen = useMediaQuery(theme.breakpoints.up('md'));

	return (
		<MuiToggleButtonGroup
			value={selectedListView}
			exclusive
			onChange={handleChange}
			orientation={`${matchesBigScreen ? 'horizontal' : 'vertical'}`}
			sx={{ width: '100%' }}
		>
			{options?.map((option: any) => {
				return (
					<ToggleButton
						key={option?.targetQuery}
						value={option?.targetQuery}
						color="primary"
						disabled={loading}
						sx={{ width: '100%' }}
					>
						{option.label}
					</ToggleButton>
				);
			})}
		</MuiToggleButtonGroup>
	);
};
