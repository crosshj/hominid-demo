import { MenuItem as MuiMenuItem } from '@mui/material';
import { useGlobal } from '../../hooks/useGlobal';

export const MenuItem = ({ type, target, label }: any) => {
	const { dispatch }: any = useGlobal();
	if (!label) return null;

	const handleAction = () => {
		dispatch({ type, target });
	};

	return <MuiMenuItem onClick={handleAction}>{label}</MuiMenuItem>;
};
