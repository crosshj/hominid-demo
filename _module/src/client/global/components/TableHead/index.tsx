import {
	Box,
	Skeleton,
	TableCell,
	TableHead as MuiTableHead,
	TableRow,
	TableSortLabel,
	Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';

export const TableHead = ({
	order,
	orderBy,
	columns,
	onRequestSort,
	loading,
}: any) => {
	if (!columns || columns.length === 0) return null;

	const createSortHandler = (property: any) => (event: any) => {
		onRequestSort(event, property);
	};

	return (
		<MuiTableHead>
			<TableRow>
				{columns.map((headCell: any) => (
					/*
						if cell is a button type and last of the row, make it sticky
						position: sticky;
						right: 0;
						background: white;
					*/
					<TableCell
						key={headCell.key}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.key ? order : false}
						sx={{ width: 'max-content' }}
					>
						<TableSortLabel
							active={orderBy === headCell.key}
							direction={orderBy === headCell.key ? order : 'asc'}
							onClick={createSortHandler(headCell.key)}
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
									headCell.label
								)}
							</Typography>
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc'
										? 'sorted descending'
										: 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</MuiTableHead>
	);
};

// TableHead.propTypes = {
// 	onRequestSort: PropTypes.func.isRequired,
// 	columns: PropTypes.array.isRequired,
// 	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
// 	//orderBy: PropTypes.string.isRequired,
// };
