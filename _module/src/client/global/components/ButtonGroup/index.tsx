import { Button, ButtonGroup as MuiButtonGroup } from '@mui/material';
import { useGlobal } from '../../hooks/useGlobal';

export const ButtonGroup = ({ buttons, type, target, ...props }: any) => {
	const { dispatch }: any = useGlobal();
	const handleClick = (e: any) => {
		if (e.stopPropagation) {
			e.stopPropagation();
		}

		dispatch({ type, target });
	};
	return (
		<MuiButtonGroup variant="outlined" onClick={handleClick} {...props}>
			{buttons?.map((button: any) => {
				return (
					<Button sx={{ width: `${100 / buttons.length}%` }}>
						{button.title}
					</Button>
				);
			})}
		</MuiButtonGroup>
	);
};
