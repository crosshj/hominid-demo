import { ArrowDownward, ArrowUpward, MoreVert } from '@mui/icons-material';
import { IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useState } from 'react';

export const TableHeadCell = ({ order, label, onRequestSort, field }: any) => {
	const [showSort, setShowSort] = useState(false);

	const SortIcon = order === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
	return (
		<TableCell
			onMouseEnter={() => setShowSort(true)}
			onMouseLeave={() => setShowSort(false)}
			sx={{
				borderBottom: 0,
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
			>
				<Stack
					direction="row"
					spacing={2}
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="subtitle2">{label}</Typography>
					<IconButton
						size="small"
						sx={{ visibility: showSort ? 'visible' : 'hidden' }}
						onClick={(e) => onRequestSort(e, field)}
					>
						{SortIcon}
					</IconButton>
				</Stack>
				<IconButton
					sx={{ visibility: showSort ? 'visible' : 'hidden' }}
				>
					<MoreVert />
				</IconButton>
			</Stack>
		</TableCell>
	);
};
