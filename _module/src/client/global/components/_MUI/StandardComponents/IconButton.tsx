import { IconButton as MuiIconButton } from '@mui/material';
import { useGlobal } from '../../../hooks/useGlobal';
import { Icon } from '../../Icon';
import { getColor } from '../../../utils/getColor';

export const IconButton = (args: any = {}) => {
	const { onClickShimmed, color, icon, size, fontSize, ...props } = args;

	const { dispatch }: any = useGlobal() || {};

	const children = [
		<Icon
			color={getColor(color)}
			icon={icon}
			fontSize={size || fontSize}
		/>,
	];

	return (
		<MuiIconButton
			onClick={(e) => {
				onClickShimmed(e, { dispatch });
			}}
			{...props}
			disabled={Boolean(props.disabled)}
		>
			{children}
		</MuiIconButton>
	);
};
