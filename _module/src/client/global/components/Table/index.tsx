import {
	Table as MuiTable,
	TableContainer,
	TablePagination,
	Stack,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { TableToolbar } from '../TableToolbar';
import { TableHead } from '../TableHead';
import { searchRows, sortRows } from './helpers';
import { TableBody, CellContent } from './components';
import { getListView } from '../../services';
import { contextParser } from '../../utils/contextParser';
import { StateManager } from '../../../state/state';

export const Table = ({
	label,
	actions,
	targetQuery,
	pagination = true,
	tableBody,
	filterOn = '',
}: any) => {
	const [{ param = '' } = {}]: any = StateManager.useListener(
		'menu',
		undefined,
		{
			note: 'Table',
		},
	);
	const [filterOnValue]: any = StateManager.useListener(filterOn);
	const [searchValue]: any = StateManager.useListener('search');
	const [searchRowKey]: any = StateManager.useListener('searchRowKey');

	const [loading, setLoading] = useState(true);
	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const isLoading = loading;
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState(
		columns ? (columns[0] as any)?.key : null,
	);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const search = filterOnValue || searchValue;

	const handleRequestSort = (_event: any, property: any) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (_event: any, newPage: any) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: any) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const sortedRows = sortRows({ rows, order, orderBy, columns });
	const searchedRows = search
		? sortedRows?.filter(searchRows({ columns, search, searchRowKey }))
		: sortedRows;

	const columnsToBeShown = columns?.filter((c: any) => !c.hidden);

	const parsedRows =
		searchedRows.map((row: any, _rowIndex: any) => {
			const dataToBeShown = row?.filter(
				(_column: any, columnIndex: any) =>
					!(columns[columnIndex] as any)?.hidden,
			);
			return dataToBeShown.map((cell: any, columnIndex: any) => {
				const column = columnsToBeShown[columnIndex];
				return (
					<CellContent
						cell={cell}
						column={column}
						columns={columns}
						row={row}
					/>
				);
			});
		}) || [];

	const paginatedRows =
		(rows &&
			rows?.length > 0 &&
			parsedRows?.slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage,
			)) ||
		[];

	const getData = useCallback(
		async (targetQuery: any) => {
			setLoading(true);

			const results = await getListView(targetQuery, param);
			const { ListProc, sp_GetResourceListViews } = results;
			const { rows, columns } =
				ListProc?.[0]?.results || sp_GetResourceListViews || {};

			setRows(rows);
			const parsedColumns = contextParser(columns);
			setColumns(parsedColumns);
			setLoading(false);
		},
		[param],
	);

	useEffect(() => {
		if (!targetQuery) return;

		try {
			getData(targetQuery);
		} catch (err) {
			console.error('getListView', err);
		}
	}, [targetQuery, getData]);

	useEffect(() => {
		if (!columns || columns.length === 0) return;

		setOrderBy((columns[0] as any)?.key);
	}, [columns]);

	return (
		<>
			<Stack spacing={0} sx={{ width: '100%' }} border="none">
				<TableToolbar
					title={label}
					actions={actions}
					loading={isLoading}
				/>

				<TableContainer sx={{ backgroundColor: 'background.contrast' }}>
					<MuiTable sx={{ width: '100%' }} aria-label="simple table">
						{columns && columns?.length > 0 && (
							<TableHead
								order={order}
								orderBy={orderBy}
								columns={columnsToBeShown}
								onRequestSort={handleRequestSort}
								rowCount={(rows as any)?.length}
								loading={isLoading}
							/>
						)}
						{tableBody || (
							<TableBody
								rows={paginatedRows}
								columnsLength={columns?.length}
								label={label}
								isLoading={isLoading}
							/>
						)}
					</MuiTable>
				</TableContainer>
				{pagination === true && rows && rows?.length > 0 && (
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={parsedRows?.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				)}
			</Stack>
		</>
	);
};
