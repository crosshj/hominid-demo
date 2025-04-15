import { Box, Grid, Skeleton, Typography } from '@mui/material';
//import { Card } from '..';
import * as S from './styles';
import { BarGraphItem } from './BarGraphItem';

export const BarGraph = ({
	label,
	data = [],
	loading,
	format,
	//hasCard = true,
	value,
}: any) => {
	const total = data?.reduce((acc: any, item: any) => {
		return acc + parseFloat(item?.value);
	}, 0);

	return (
		<Box sx={{ width: '100%' }}>
			<Grid
				container
				direction="row"
				justifyContent="space-between"
				alignItems="center"
			>
				<Typography variant="h2" my={1}>
					{label}
				</Typography>

				<Grid
					item
					xs={2}
					direction="row"
					display="flex"
					justifyContent="flex-end"
				>
					{value}
				</Grid>
			</Grid>
			<S.BarGraphCard
				sx={{ width: '100%' }}
				direction={{ xs: 'column', md: 'row' }}
			>
				{loading && data.length === 0 ? (
					<Skeleton
						variant={'rounded' as any}
						width="100%"
						height="100%"
					/>
				) : (
					data?.map((item: any, index: any) => {
						return (
							<BarGraphItem
								key={index}
								{...item}
								format={format}
								total={total}
								all={data}
								index={index}
							/>
						);
					})
				)}
			</S.BarGraphCard>
		</Box>
	);
};
