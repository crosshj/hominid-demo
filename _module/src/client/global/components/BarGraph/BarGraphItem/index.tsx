import { Box, Stack, Typography } from '@mui/material';
import { Icon } from '../../Icon';
import { iconMap } from '../../utils/icon';
import { colorMap, getColor } from '../utils/color';
import { getFormatFunction } from '../utils/format';
import { getItemSize } from '../utils/size';
import * as S from './styles';

export const BarGraphItem = ({
	icon,
	value,
	label,
	color,
	format,
	total,
	index,
	length,
	all,
}: any) => {
	const formatFunction = getFormatFunction(format);
	const size = all
		? getItemSize({ all, index })
		: getItemSize(value, total, length);

	return (
		<S.BarGraphItem
			color={(color && colorMap(color)) || getColor(index)}
			width={{
				xs: '100%',
				md: size,
			}}
			direction={{ xs: 'row', md: 'column' }}
			key={index}
		>
			<Typography variant="h3">
				{(formatFunction && formatFunction(value)) || value}
			</Typography>
			<Stack
				direction="row"
				alignItems="center"
				spacing={1}
				justifyContent={{
					xs: 'center',
					md: 'unset',
				}}
				sx={{ flex: { xs: 1, md: 0 } }}
			>
				<Box
					sx={{
						display: {
							md: 'hidden',
						},
					}}
				>
					{icon !== 'false' && (iconMap as any)[colorMap(color)] && (
						<Icon>{(iconMap as any)[colorMap(color)]}</Icon>
					)}
				</Box>
				<Typography variant="subtitle1">{label || ''}</Typography>
			</Stack>
		</S.BarGraphItem>
	);
};
