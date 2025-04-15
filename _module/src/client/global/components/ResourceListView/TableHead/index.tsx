import { TableHead as MuiTableHead, TableRow } from '@mui/material';
//import PropTypes from 'prop-types';
import { cloneElement } from 'react';

export const TableHead = ({
	order,
	orderBy,
	onRequestSort,
	loading,
	children,
}: any) => {
	const a = children?.map((child: any) => {
		return cloneElement(child, {
			order,
			orderBy,
			onRequestSort,
			loading,
		});
	});
	return (
		<MuiTableHead>
			<TableRow>{a}</TableRow>
		</MuiTableHead>
	);
};

// TableHead.propTypes = {
// 	onRequestSort: PropTypes.func.isRequired,
// 	// columns: PropTypes.array.isRequired,
// 	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
// 	//orderBy: PropTypes.string.isRequired,
// };
