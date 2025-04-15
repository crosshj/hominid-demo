import {
	Stack,
	Table as MuiTable,
	TableContainer,
	TablePagination,
} from '@mui/material';
import { useState } from 'react';
import { TableToolbar } from '../TableToolbar';
import { ColumnFilterMenu } from './components/ColumnFilterMenu';
import { TableBody } from './components/TableBody';
import { TableHead } from './components/TableHead';

export const DataEditView = ({
	label,
	rows = [],
	columns = [],
	visibleColumns = [],
	hiddenHideableColumns = [],
	columnsVisibilityState = [],
	columnsToShow = [],
	actions = [],
	order,
	orderBy,
	isLoading,
	pagination,
	page,
	handleRequestSort,
	handleChangePage,
	handleChangeRowsPerPage,
	rowsPerPage,
	handleToggleShowColumn,
	toolbar = false,
}: any) => {
	const [columnFilterEl, setColumnFilterEl] = useState(null);
	const isColumnFilterOpen = Boolean(columnFilterEl);

	const handleOpenColumnFilter = (e: any) => {
		setColumnFilterEl(e.target);
	};
	const handleCloseColumnFilter = () => {
		setColumnFilterEl(null);
	};

	return (
		<>
			<Stack spacing={0} sx={{ width: '100%' }} border="none">
				{toolbar && (
					<TableToolbar
						title={label}
						actions={actions}
						loading={isLoading}
						handleOpenColumnFilter={handleOpenColumnFilter}
						columns={columns}
						columnsToShow={columnsToShow}
						handleToggleShowColumn={handleToggleShowColumn}
					/>
				)}

				<TableContainer sx={{ backgroundColor: 'background.contrast' }}>
					<MuiTable sx={{ width: '100%' }} aria-label="simple table">
						{columns?.length > 0 && (
							<TableHead
								order={order}
								orderBy={orderBy}
								columns={visibleColumns}
								hiddenHideableColumns={hiddenHideableColumns}
								onRequestSort={handleRequestSort}
								rowCount={rows?.length}
								handleOpenColumnFilter={handleOpenColumnFilter}
							/>
						)}

						<TableBody
							columns={visibleColumns}
							rows={rows}
							columnsLength={columns?.length}
							label={label}
							isLoading={isLoading}
						/>
					</MuiTable>
				</TableContainer>
				{pagination && rows && rows?.length > 0 && (
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={rows?.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				)}
			</Stack>
			<ColumnFilterMenu
				anchorEl={columnFilterEl}
				open={isColumnFilterOpen}
				handleClose={handleCloseColumnFilter}
				columns={columnsVisibilityState}
				handleToggleShowColumn={handleToggleShowColumn}
			/>
		</>
	);
};
