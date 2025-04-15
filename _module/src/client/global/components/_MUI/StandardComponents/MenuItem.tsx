import { MenuItem as MuiMenuItem } from '@mui/material';
import { useGlobal } from '../../../hooks/useGlobal';

export const MenuItem = (args: any = {}) => {
	const { onClickShimmed, label, ...props } = args;

	const { dispatch }: any = useGlobal() || {};

	return (
		<MuiMenuItem
			onClick={(e) => {
				onClickShimmed(e, { dispatch });
			}}
			{...props}
		>
			{label}
		</MuiMenuItem>
	);
};
