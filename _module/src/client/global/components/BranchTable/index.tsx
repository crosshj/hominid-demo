import {
	TableContainer,
	Table as MuiTable,
	TableBody,
	TableCell,
	Stack,
	IconButton,
	Typography,
} from '@mui/material';
import { AddCircleRounded } from '@mui/icons-material';
import { renderMode } from '../utils/renderMode';
import { TableHead } from '../DataEditView/components/TableHead';
import { TableToolbar } from '../TableToolbar';
import { CollapsibleTable } from '../CollapsibleTable';
import * as S from '../CollapsibleTable/styles';

const getType = (level: any) => {
	const remainder = level % 3;
	switch (remainder) {
		case 0:
			return 'branch';
		case 1:
			return 'client';
		case 2:
			return 'talent';
		default:
			return '';
	}
};

export const BranchTable = ({
	label,
	rows = [],
	columns = [],
	visibleColumns = [],
	actions = [],
	order,
	orderBy,
	isLoading,
	handleRequestSort,
	handleToggleShowColumn,
	columnsToShow,
	nestingLevels,
	editable,
	handleAddRow,
}: any) => {
	const getNestedBody = (data: any, levels: any, level = 0) => {
		const isLastLevel = level === levels - 1;
		const type = getType(level);
		return data.map((row: any) => {
			const { _params, children } = row;
			const openActions =
				level === levels - 1
					? [
							{
								name: 'edit',
								markDirty: () => {},
							},
					  ]
					: [];
			if (level <= levels && children)
				return (
					<CollapsibleTable
						type={type}
						columns={visibleColumns}
						values={row}
						editable={editable}
						isLastLevel={isLastLevel}
						openActions={openActions as any}
					>
						{getNestedBody(children, levels, level + 1)}
						{isLastLevel && editable && (
							<S.TableRow>
								<TableCell colSpan={visibleColumns.length}>
									<Stack
										justifyContent="center"
										alignItems="center"
										direction="row"
									>
										<IconButton
											onClick={() =>
												handleAddRow(_params, level)
											}
										>
											<AddCircleRounded color="primary" />
											<Typography ml={1}>
												Add Line Item
											</Typography>
										</IconButton>
									</Stack>
								</TableCell>
							</S.TableRow>
						)}
					</CollapsibleTable>
				);

			return (
				// <S.TableRow>
				// 	{visibleColumns.map((col) => {
				// 		const value = isNumber(row[col.field])
				// 			? parseFloat(row[col.field]).toFixed(2)
				// 			: row[col.field];
				// 		return <S.TableCell size="small">{value}</S.TableCell>;
				// 	})}
				// </S.TableRow>
				<S.TableRow
					sx={{
						backgroundColor: 'white',
					}}
				>
					{visibleColumns.map((col: any) => {
						//let field;
						let index;
						let item;
						let target = rows;
						for (const param in _params) {
							index = target.findIndex(
								(row: any) => row._id === _params[param],
							);
							item = target[index];
							target =
								param !== level + '' ? item?.children : null;
							// field += `[${index}]${
							// 	target !== null ? '.children' : ''
							// }`;
						}
						let value = row[col.field];
						let cell = col.renderCell({
							value,
							row,
							colDef: col,
							id: `${_params}`,
						});
						if (col.children) {
							const cases = col.children.filter(
								(x: any) => x.type.toLowerCase() === 'case',
							);
							const trueCase = cases.find(
								(x: any) =>
									x.props.when === row[x.props.property],
							);
							if (trueCase) {
								debugger;
								value = row[col.field];
								const renderCell =
									(renderMode as any)[
										trueCase.props.variant
									] || renderMode['text'];
								cell = renderCell({
									value,
									colDef: { ...col, ...trueCase },
								});
							}
						}
						return <S.TableCell>{cell}</S.TableCell>;
					})}
				</S.TableRow>
			);
		});
	};

	return (
		<Stack spacing={0} mb={4} sx={{ width: '100%' }} border="none">
			<TableToolbar
				title={label}
				actions={actions}
				loading={isLoading}
				columns={columns}
				columnsToShow={columnsToShow}
				handleToggleShowColumn={handleToggleShowColumn}
			/>
			<TableContainer>
				<MuiTable
					sx={{}}
					aria-label="simple table"
					style={{ tableLayout: 'fixed' }}
				>
					{columns?.length > 0 && (
						<TableHead
							order={order}
							orderBy={orderBy}
							columns={visibleColumns}
							onRequestSort={handleRequestSort}
							rowCount={rows?.length}
							loading={isLoading}
							sx={{
								borderBottom: 0,
							}}
						/>
					)}
					<TableBody>{getNestedBody(rows, nestingLevels)}</TableBody>
					{/* <TableBody>
						{getNestedBody(
							editable ? values?.values || [] : rows,
							nestingLevels,
							0
						)}
					</TableBody> */}
				</MuiTable>
			</TableContainer>
		</Stack>
	);
};
