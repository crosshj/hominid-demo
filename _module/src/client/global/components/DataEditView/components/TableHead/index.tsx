import { TableHead as MuiTableHead, TableRow, TableCell } from '@mui/material';

//import PropTypes from 'prop-types';
import { TableHeadCell } from '../TableHeadCell';

export const TableHead = ({
	order,
	orderBy,
	columns = [],
	onRequestSort,
}: any) => {
	if (!columns || columns.length === 0) return null;

	return (
		<MuiTableHead>
			<TableRow>
				{columns?.map((column: any, i: any) => {
					return (
						<TableHeadCell
							key={'table-head-cell-' + i}
							order={order}
							orderBy={orderBy}
							onRequestSort={onRequestSort}
							{...column}
						/>
					);
				})}
				<TableCell
					sx={{
						borderBottom: 0,
					}}
				>
					{/* <AddCircleRounded onClick={handleOpenColumnFilter} /> */}
				</TableCell>
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
