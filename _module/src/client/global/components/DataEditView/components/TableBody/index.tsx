import {
	LinearProgress,
	TableRow,
	TableCell,
	TableBody as MuiTableBody,
} from '@mui/material';

export const TableBody = ({
	columns,
	rows,
	columnsLength,
	label,
	isLoading,
}: any) => {
	return (
		<>
			{isLoading && (
				<MuiTableBody>
					<TableRow>
						<TableCell
							colSpan={columnsLength}
							sx={{
								width: '100%',
							}}
						>
							<LinearProgress
								sx={{
									lineHeight: 'unset',
								}}
							/>
						</TableCell>
					</TableRow>
				</MuiTableBody>
			)}

			<MuiTableBody>
				{rows?.map((row: any, rowId: any) => (
					<TableRow key={`${label}-${rowId}`}>
						{columns?.map((column: any, columnIndex: any) => {
							const value = row[column?.field];
							const { renderCell } = column;
							const cell = renderCell({
								value,
								colDef: column,
								id: row?.id,
								row,
							});

							return (
								<TableCell
									key={`${label}-${rowId}-${columnIndex}`}
									sx={{
										width: 'fit-content',
									}}
								>
									{cell}
								</TableCell>
							);
						})}
					</TableRow>
				))}
			</MuiTableBody>
		</>
	);
};
