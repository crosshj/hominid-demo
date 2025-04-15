import {
	Box,
	Typography,
	Skeleton,
	TableCell,
	TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

export const Column = ({
	order,
	orderBy,
	loading,
	onRequestSort,
	column,
}: any) => {
	const createSortHandler = (property: any) => (event: any) => {
		onRequestSort(event, property);
	};
	return (
		<TableCell
			key={column.key}
			align={column.numeric ? 'right' : 'left'}
			padding={column.disablePadding ? 'none' : 'normal'}
			sortDirection={orderBy === column.key ? order : false}
			sx={{ width: 'max-content' }}
		>
			<TableSortLabel
				active={orderBy === column.key}
				direction={orderBy === column.key ? order : 'asc'}
				onClick={createSortHandler(column.key)}
				sx={{ width: 'inherit' }}
			>
				<Typography variant="subtitle2">
					{loading ? (
						<Skeleton
							variant="text"
							width={100}
							sx={{ fontSize: '1rem' }}
						/>
					) : (
						column.label
					)}
				</Typography>
				{orderBy === column.id ? (
					<Box component="span" sx={visuallyHidden}>
						{order === 'desc'
							? 'sorted descending'
							: 'sorted ascending'}
					</Box>
				) : (
					''
				)}
			</TableSortLabel>
		</TableCell>
	);
};
