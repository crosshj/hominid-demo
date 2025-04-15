import { Chip as MuiChip } from '@mui/material';
import { useGlobal } from '../../../hooks/useGlobal';
import { getColor } from '../../../utils/getColor';
import { Icon } from '../../Icon';

export const Chip = (args: any = {}) => {
	const {
		onClickShimmed,
		backgroundColor,
		color,
		icon,
		deleteIcon,
		deleteIconColor,
		deleteIconClass,
		iconClass,
		children,
		...props
	} = args;

	const { dispatch }: any = useGlobal() || {};

	const _icon = icon ? <Icon icon={icon} className={iconClass} /> : null;
	const _deleteIcon = deleteIcon ? (
		<Icon
			icon={deleteIcon}
			className={deleteIconClass}
			color={deleteIconColor}
		/>
	) : null;

	const _color = color ? getColor(color) : undefined;

	return (
		<MuiChip
			color="primary"
			{...props}
			onClick={(e: any) => {
				onClickShimmed(e, { dispatch });
			}}
			deleteIcon={_deleteIcon}
			icon={_icon}
			style={{
				backgroundColor: getColor(backgroundColor),
				...(_color
					? { color: _color, border: `1px solid ${_color}` }
					: {}),
			}}
		></MuiChip>
	);
};
