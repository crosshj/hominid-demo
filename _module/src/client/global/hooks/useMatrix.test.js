describe('disabled', () => {
	it('disabled', () => {});
});

// import { getOptions, addMatrixUtils } from './useMatrix';

// const scenario1 = (() => {
// 	const results = [
// 		{
// 			AssignmentName: {
// 				value: '',
// 				label: '',
// 				default: true,
// 			},
// 			PayTypeText: false,
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 0,
// 				label: 'Rappebover Holdings Company.',
// 				default: true,
// 			},
// 			PayTypeText: false,
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 1,
// 				label: 'Parglibistor Corp.',
// 				default: true,
// 			},
// 			PayTypeText: false,
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 2,
// 				label: 'Unbillable',
// 				default: true,
// 			},
// 			PayTypeText: false,
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 0,
// 				label: 'Rappebover Holdings Company',
// 			},
// 			PayTypeText: {
// 				value: '',
// 				label: '',
// 			},
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 1,
// 				label: 'Parglibistor Corp.',
// 			},
// 			PayTypeText: {
// 				value: '',
// 				label: '',
// 			},
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 2,
// 				label: 'Unbillable',
// 			},
// 			PayTypeText: {
// 				value: '',
// 				label: '',
// 			},
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 0,
// 				label: 'Rappebover Holdings Company',
// 			},
// 			PayTypeText: {
// 				value: 4,
// 				label: 'Bonus',
// 			},
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: true,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 1,
// 				label: 'Parglibistor Corp.',
// 			},
// 			PayTypeText: {
// 				value: 4,
// 				label: 'Bonus',
// 			},
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: true,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 2,
// 				label: 'Unbillable',
// 			},
// 			PayTypeText: {
// 				value: 1000,
// 				label: 'Hourly',
// 			},
// 			RegHrs: true,
// 			OTHrs: true,
// 			TotalAmount: false,
// 		},
// 		{
// 			AssignmentName: {
// 				value: 2,
// 				label: 'Unbillable',
// 			},
// 			PayTypeText: {
// 				value: 4,
// 				label: 'Bonus',
// 			},
// 			RegHrs: false,
// 			OTHrs: false,
// 			TotalAmount: true,
// 		},
// 	];

// 	const matrix = {
// 		results: { 'PaycheckId-1': results },
// 		params: ['PaycheckId'],
// 	};
// 	addMatrixUtils(matrix);
// 	return matrix;
// })();

// const scenario2 = (() => {
// 	const results = [
// 		{
// 			deductionType: {
// 				value: '',
// 				label: '',
// 				default: true,
// 			},
// 			Descrip: false,
// 			Amount: false,
// 		},
// 		{
// 			deductionType: {
// 				value: 0,
// 				label: 'Deduction Type 1',
// 			},
// 			Descrip: false,
// 			Amount: false,
// 		},
// 		{
// 			deductionType: {
// 				value: 1,
// 				label: 'Deduction Type 2',
// 			},
// 			Descrip: true,
// 			Amount: true,
// 		},
// 	];
// 	const matrix = {
// 		results: { 'PaycheckId-1': results },
// 		params: ['PaycheckId'],
// 	};
// 	addMatrixUtils(matrix);
// 	return matrix;
// })();

// xdescribe('get options, row has a single options list', () => {
// 	const scenario2Row = (args = {}) => ({
// 		PaycheckId: 1,
// 		deductionType: '',
// 		Amount: '',
// 		Descrip: '',
// 		userAdded: true,
// 		isEditable: true,
// 		...args,
// 	});
// 	it('selected nothing', () => {
// 		const colOpts = (column) =>
// 			getOptions({
// 				matrix: scenario2,
// 				row: scenario2Row(),
// 				column,
// 			});
// 		expect(colOpts('deductionType').length).toBe(3);
// 		expect(colOpts('Amount')).toBe('hidden');
// 		expect(colOpts('Descrip')).toBe('hidden');
// 	});

// 	it('selected deduction, fields hidden', () => {
// 		const colOpts = (column) =>
// 			getOptions({
// 				matrix: scenario2,
// 				row: scenario2Row({ deductionType: 0 }),
// 				column,
// 			});
// 		expect(colOpts('deductionType').length).toBe(3);
// 		expect(colOpts('Amount')).toBe('hidden');
// 		expect(colOpts('Descrip')).toBe('hidden');
// 	});

// 	it('selected deduction, fields shown', () => {
// 		const colOpts = (column) =>
// 			getOptions({
// 				matrix: scenario2,
// 				row: scenario2Row({ deductionType: 1 }),
// 				column,
// 			});
// 		expect(colOpts('deductionType').length).toBe(3);
// 		expect(colOpts('Amount')).toBe('input');
// 		expect(colOpts('Descrip')).toBe('input');
// 	});
// });

// xdescribe('get options, row has multiple options lists', () => {
// 	const scenario1Row = (args = {}) => ({
// 		PaycheckId: 1,
// 		AssignmentName: '',
// 		PayTypeText: '',
// 		RegHrs: '',
// 		OTHrs: '',
// 		TotalAmount: '',
// 		isEditable: true,
// 		userAdded: true,
// 		...args,
// 	});
// 	it('selected nothing', () => {
// 		const matrix = scenario1;
// 		const row = scenario1Row({});
// 		const colOpts = (column) => getOptions({ matrix, row, column });
// 		expect(colOpts('AssignmentName').length).toBe(7);
// 		expect(colOpts('PayTypeText')).toBe('hidden');
// 		expect(colOpts('RegHrs')).toBe('hidden');
// 		expect(colOpts('OTHrs')).toBe('hidden');
// 		expect(colOpts('TotalAmount')).toBe('hidden');
// 	});
// 	it('selected first option', () => {
// 		const matrix = scenario1;
// 		const row = scenario1Row({ AssignmentName: 0 });
// 		const colOpts = (column) => getOptions({ matrix, row, column });
// 		expect(colOpts('AssignmentName').length).toBe(7);
// 		expect(colOpts('PayTypeText').length).toBe(2);
// 		expect(colOpts('RegHrs')).toBe('hidden');
// 		expect(colOpts('OTHrs')).toBe('hidden');
// 		expect(colOpts('TotalAmount')).toBe('hidden');
// 	});
// 	it('selected first and second option, all fields except last hidden', () => {
// 		const matrix = scenario1;
// 		const row = scenario1Row({ AssignmentName: 1, PayTypeText: 4 });
// 		const colOpts = (column) => getOptions({ matrix, row, column });
// 		expect(colOpts('AssignmentName').length).toBe(7);
// 		expect(colOpts('PayTypeText').length).toBe(2);
// 		expect(colOpts('RegHrs')).toBe('hidden');
// 		expect(colOpts('OTHrs')).toBe('hidden');
// 		expect(colOpts('TotalAmount')).toBe('input');
// 	});
// 	it('selected first and second option, all fields except last shown', () => {
// 		const matrix = scenario1;
// 		const row = scenario1Row({ AssignmentName: 2, PayTypeText: 1000 });
// 		const colOpts = (column) => getOptions({ matrix, row, column });
// 		expect(colOpts('AssignmentName').length).toBe(5);
// 		expect(colOpts('PayTypeText').length).toBe(3);
// 		expect(colOpts('RegHrs')).toBe('input');
// 		expect(colOpts('OTHrs')).toBe('input');
// 		expect(colOpts('TotalAmount')).toBe('hidden');
// 	});
// });
