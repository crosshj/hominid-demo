import { Link as MuiLink } from '@mui/material';
import _ from 'lodash';
import { useGlobal } from '../../../hooks/useGlobal';
import { getColor } from '../../../utils/getColor';

export const Link = (args: any = {}) => {
	const { onClickShimmed, color, ...props } = args;

	const { dispatch }: any = useGlobal() || {};

	return (
		<MuiLink
			color={color ? getColor(color) : undefined}
			onClick={(e) => {
				onClickShimmed(e, { dispatch });
			}}
			{...props}
		></MuiLink>
	);
};
