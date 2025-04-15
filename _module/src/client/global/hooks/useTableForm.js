import { useEffect } from 'react';
import { useData } from './useData.js';
import { StateManager } from '../../state/state';

export const useTableForm = ({ rows, rowMatrix, nesting, source }) => {
	const { data: values, setData } = useData({ key: 'table' });
	const [state, setState] = StateManager.useListener();

	const handleAddRow = (params, level) => {
		let field = 'values';
		let index;
		let item;
		let target = rows;
		for (const param in params) {
			index = target.findIndex((row) => row._id === params[param]);
			item = target[index];
			target = param !== level ? item?.children : null;
			field += `[${index}]${target !== null ? '.children' : ''}`;
		}
		const value = values[field];

		setData({
			...value,
			// HARDCODED - SHOULD BE DYNAMIC AND FOR ALL COLUMNS
			children: [
				...value.children,
				{
					PaycheckID: 3,
					PayTypeID: 0,
					PayCheckPaysID: 5,
					PayTypeText: 'Not Paid Break',
					RegHrs: null,
					OTHrs: null,
					DTHrs: null,
					TotalAmount: 32.23,
					isTaxable: true,
					W2Box: null,
					'branchAssignmentID.hidden': 39,
					AssignmentName: 'Rappebover Holdings Company - 39',
					'branchEmployeeID.hidden': 15,
					EmployeeName: 'Matthew Lozano',
					'tenantBranchID.hidden': 1,
					BranchName: 'Lubbock',
					id: 98,
				},
			],
		});
	};

	const handleAddNewRow = (args) => {
		const prev = state[source];
		const foundBase = args?.children?.[0]; //TODO: what if there are no children? is that possible?
		const newRow = Object.keys(foundBase).reduce(
			(a, o) => ({ ...a, [o]: '' }),
			{},
		);
		newRow.userAdded = true;
		newRow.isEditable = true;
		newRow.id = Math.random();

		for (const name of Object.values(args?.nesting?.names || [])) {
			newRow[name] = foundBase[name];
		}
		for (const name of Object.values(args?.nesting?.params || [])) {
			newRow[name] = foundBase[name];
		}
		for (const param of rowMatrix.params) {
			newRow[param] = foundBase[param];
		}
		const newState = {
			[source]: [...prev, newRow],
		};
		setState(newState);
	};

	const handleUpdateRow = ({ row, update }) => {
		const prev = state[source];
		const rowToEdit = prev.find((x) => x.id === row.id);
		const updatedRow = { ...rowToEdit, ...update };
		const prevMinusEdited = prev.filter((x) => x.id !== row.id);

		const newState = {
			[source]: [...prevMinusEdited, updatedRow],
		};
		setState(newState);
	};

	useEffect(() => {
		if (nesting?.params?.length <= 0) return;
		setData(rows);
	}, [rows, nesting?.params, setData]);

	return {
		handleAddRow,
		handleUpdateRow,
		handleAddNewRow,
		formValues: values,
	};
};
