import { actionsList, getNesting } from '../utils';
import { useGlobal } from './useGlobal';
import { useColumnsManager } from './useColumnsManager';
import { useRowsViewManager } from './useRowsViewManager';
import { useRows } from './useRows';
import { useMatrix } from './useMatrix';
//import { useTableForm } from './useTableForm';

export const useTable = (args) => {
	const { label, props = {}, search, searchRowKey } = args;

	const {
		source,
		sourceParams,
		editable,
		flowKey,
		flowStep,
		weekPickerName,
		weekPickerQuery,
		disableWeekPicker,
		dataKey,
		paramName,
		rowsPerPage: rowsPerPageProp = 10,
		...propsRest
	} = props;

	const { dispatch } = useGlobal();
	const nesting = getNesting(props, args);

	const { rows, isLoading } = useRows({
		nesting,
		sourceParams,
		source,
		dataKey,
		paramName,
		search,
	});
	// TODO: rows is never received on useMatrix, why we pass it then?
	const { rowMatrix } = useMatrix(args, rows);

	const {
		columns,
		columnsToShow,
		visibleColumns,
		hiddenHideableColumns,
		columnsVisibilityState,
		handleToggleShowColumn,
	} = useColumnsManager(args?.children, rowMatrix, dispatch, source);

	const {
		order,
		orderBy,
		page,
		rowsPerPage,
		paginatedRows,
		handleRequestSort,
		handleChangePage,
		handleChangeRowsPerPage,
	} = useRowsViewManager({
		rows,
		columns,
		search,
		searchRowKey,
		rowsPerPageProp,
	});

	// const { handleAddRow, handleUpdateRow, handleAddNewRow, formValues } =
	// 	useTableForm({
	// 		rows,
	// 		rowMatrix,
	// 		flowKey,
	// 		flowStep,
	// 		nesting,
	// 		source,
	// 	});
	const handleAddRow = () =>
		console.log('TODO: fix this, was causing errors');
	const handleUpdateRow = () =>
		console.log('TODO: fix this, was causing errors');
	const handleAddNewRow = () =>
		console.log('TODO: fix this, was causing errors');
	const formValues = undefined;

	const actions =
		Object.entries(args?.props || {})?.reduce((acc, [label, value]) => {
			if (actionsList.includes(label) && (value === 'true' || value)) {
				acc.push(label);
			}
			return acc;
		}, []) || []; //final format: ['readCSV', 'readPDF'] if readCSV and readPDF are true

	return {
		...propsRest,
		dispatch,
		label,
		// rows: paginatedRows, //(we only use NestedTable now, and pagination at this level leads to wonky behavior)
		rows, // instead, rows are just rows for now
		columns,
		visibleColumns,
		hiddenHideableColumns,
		columnsVisibilityState,
		actions: actions || [],
		order,
		orderBy,
		isLoading,
		pagination: true,
		page,
		rowsPerPage,
		handleRequestSort,
		handleChangePage,
		handleChangeRowsPerPage,
		handleToggleShowColumn,
		columnsToShow,
		editable,
		handleAddRow,
		handleAddNewRow,
		handleUpdateRow,
		values: formValues,
		weekPickerName,
		weekPickerQuery,
		disableWeekPicker: disableWeekPicker === 'true' ? true : false,
		rowMatrix,
		nesting,
		//modifiers,
		//DEPRECATE: use a nesting object instead
		nestingLevels: nesting?.levels,
		nestingParams: nesting?.params,
	};
};
