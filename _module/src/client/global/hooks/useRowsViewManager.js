import { searchRows, sortRows } from '../components/DataEditView/helpers';
import { useState } from 'react';

export const useRowsViewManager = ({
	columns,
	rows,
	search,
	searchRowKey,
	rowsPerPageProp,
}) => {
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState(columns ? columns[0]?.key : null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageProp);

	const sortedRows = sortRows({ rows, order, orderBy, columns });
	const searchedRows = search
		? sortedRows?.filter(searchRows({ columns, search, searchRowKey }))
		: sortedRows;
	const paginatedRows =
		searchedRows?.slice(
			page * rowsPerPage,
			page * rowsPerPage + rowsPerPage,
		) || [];

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return {
		order,
		orderBy,
		page,
		rowsPerPage,
		setRowsPerPage,
		paginatedRows,
		handleRequestSort,
		handleChangePage,
		handleChangeRowsPerPage,
	};
};
