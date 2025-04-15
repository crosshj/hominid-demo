import { Icon as MuiIcon, SvgIcon } from '@mui/material';
import { SnakeCase } from '../../utils';
import { getColor } from '../../utils/getColor';
import { customMap } from './custom';
export const Icon = ({ icon, color, children, ...props }: any) => {
	const CustomIcon = (customMap as any)[icon];

	if (CustomIcon) {
		return (
			<SvgIcon>
				<CustomIcon />
			</SvgIcon>
		);
	}
	return (
		<MuiIcon sx={{ color: getColor(color) }} {...props}>
			{SnakeCase(icon) || children}
		</MuiIcon>
	);
};
