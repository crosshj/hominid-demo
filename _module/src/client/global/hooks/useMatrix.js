import { getData } from '../services';
import { useCallback, useEffect, useState } from 'react';
import { StateManager } from '../../state/state';

const matrixResultKey = (row, rowMatrix) => {
	if (!row?.userAdded) {
		//console.log(row);
		return;
	}
	const key = rowMatrix.params
		.map((param) => `${param}-${row[param]}`)
		.join('-');
	return key;
};

export const getOptions = ({ matrix, column, row }) => {
	const matrixResults = matrix.get(row);
	if (!matrixResults) return 'default';
	if (!row?.isEditable || !row?.userAdded) return 'default';

	const isOptionsColumn = matrixResults.some(
		(x) => typeof x[column] === 'object',
	);

	let selectedState;
	for (const def of matrixResults) {
		const optionsCols = Object.keys(def).filter(
			(key) => typeof def[key] === 'object',
		);
		const match = optionsCols.every(
			(col) =>
				[row[col], row[col] + ''].includes(def[col]?.value + '') &&
				!def[col].default === true,
		);
		if (match) {
			selectedState = def;
			break;
		}
	}
	if (!isOptionsColumn && selectedState) {
		return selectedState[column] ? 'input' : 'hidden';
	}

	let options = [];
	for (const def of matrixResults) {
		let isPossible = true;
		for (const col of Object.keys(row)) {
			if (typeof def[col] !== 'object') continue;
			if (def[col]?.default) continue;
			if (col === column) continue;
			if ([row[col], row[col] + ''].includes(def[col]?.value + ''))
				continue;
			isPossible = false;
		}
		if (isPossible) options.push(def);
	}
	if (options.some((x) => typeof x[column] === 'object')) {
		options = options.filter((x) => typeof x[column] === 'object');
	}
	const columnOptions = options.map((x) => x[column]);
	if (columnOptions.every((x) => x === false)) return 'hidden';

	return columnOptions;
};

const getRowMatrix = (args) => {
	const { rowMatrix: query, rowMatrixParams = '' } = args?.props || {};
	const params = rowMatrixParams.split(',').map((x) => x.trim());
	const matrix = { query, params, results: {} };
	return matrix;
};

export const addMatrixUtils = (rowMatrix) => {
	rowMatrix.getKey = (row) => matrixResultKey(row, rowMatrix);
	rowMatrix.get = (row) => {
		const k = rowMatrix.getKey(row);
		if (!k) return {};
		return rowMatrix.results[k];
	};
	rowMatrix.getOptions = (args) => getOptions({ ...args, matrix: rowMatrix });
};

const updateRowMatrix = (data, rowMatrix, setRowMatrix) => {
	if (!Array.isArray(data)) return;
	const missingMatrix = data.filter((row) => !rowMatrix.get(row));
	const fetchMissing = async () => {
		const addResults = {};
		for (const row of missingMatrix) {
			const params = []; //TODO: fill in params for backend query
			const rowKey = rowMatrix.getKey(row);
			if (!rowKey) continue;
			addResults[rowKey] = await getData(
				'listView',
				params,
				undefined,
				rowMatrix.query,
			);
		}
		return Object.keys(addResults).length ? addResults : undefined;
	};
	fetchMissing().then((toadd) => {
		if (!toadd) return;
		setRowMatrix({
			...rowMatrix,
			results: {
				...rowMatrix.results,
				...toadd,
			},
		});
	});
};

export const useMatrix = (args) => {
	const rowMatrixConfig = getRowMatrix(args);
	// TODO: assess whether rowMatrix state is needed or not
	const [rowMatrix, setRowMatrix] = useState(rowMatrixConfig);
	addMatrixUtils(rowMatrix);

	const { source } = args?.props || {};
	const [data] = StateManager.useListener(source);

	const updateMatrix = useCallback(
		(data) => updateRowMatrix(data, rowMatrix, setRowMatrix),
		[rowMatrix, setRowMatrix],
	);

	useEffect(() => {
		updateMatrix(data);
	}, [data, updateMatrix]);

	return { rowMatrix };
};
