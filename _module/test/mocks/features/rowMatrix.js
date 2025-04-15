/*

    see also: 
    kludge/mocks_json/payChecksDeductionsOptionsMatrix.js
    kludge/mocks_json/payChecksPaysOptionsMatrix.js


*/
const uberOptions = {
	AssignmentName: ['', 'opt1', 'opt2'],
	PayTypeText: {
		opt1: ['optA', 'optB'],
		opt2: ['optC', 'optD'],
	},
	RegHrs: {
		opt1: {
			optA: false,
			optB: true,
		},
		opt2: {
			optC: false,
			optD: true,
		},
	},
	OTHrs: false,
	DTHrs: false,
	TotalAmount: false,
};

/*
	AssignmentNameValue: ‘’,
	AssignmentNameLabel: ‘’,
	true,
	PayTypeTextValue: ‘’,
	PayTypeTextLabel: ‘’,
	PayTypeTextVisible: false,
	RegHrsVisible: false,
	OTHrsVisible: false,
	DTHrsVisible:  false,
	TotalAmountVisible: false,
*/

module.exports = () =>
	JSON.stringify([
		{
			AssignmentName: {
				value: '',
				label: '- Choose a Client -',
				default: true,
			},
			PayTypeText: false,
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},
		{
			AssignmentName: {
				value: 0,
				label: 'Rappebover Holdings Company.',
				default: true,
			},
			PayTypeText: false,
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},
		{
			AssignmentName: {
				value: 1,
				label: 'Parglibistor Corp.',
				default: true,
			},
			PayTypeText: false,
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable', default: true },
			PayTypeText: false,
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},

		//no selection is made (2nd column)
		{
			AssignmentName: { value: 0, label: 'Rappebover Holdings Company' },
			PayTypeText: { value: '', label: '- Choose a Pay Type -' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},
		{
			AssignmentName: { value: 1, label: 'Parglibistor Corp.' },
			PayTypeText: { value: '', label: '- Choose a Pay Type -' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: '', label: '- Choose a Pay Type -' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: false,
		},

		{
			AssignmentName: { value: 0, label: 'Rappebover Holdings Company' },
			PayTypeText: { value: 4, label: 'Bonus' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 0, label: 'Rappebover Holdings Company.' },
			PayTypeText: { value: 5, label: 'Holiday' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 0, label: 'Rappebover Holdings Company.' },
			PayTypeText: { value: 6, label: 'Hazard' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 0, label: 'Rappebover Holdings Company.' },
			PayTypeText: { value: 7, label: 'Per Diem' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 0, label: 'Rappebover Holdings Company.' },
			PayTypeText: { value: 8, label: 'Expense Reimbursement' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 1, label: 'Parglibistor Corp.' },
			PayTypeText: { value: 4, label: 'Bonus' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 1, label: 'Parglibistor Corp.' },
			PayTypeText: { value: 5, label: 'Holiday' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 1, label: 'Parglibistor Corp.' },
			PayTypeText: { value: 6, label: 'Hazard' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 1, label: 'Parglibistor Corp.' },
			PayTypeText: { value: 7, label: 'Per Diem' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 1, label: 'Parglibistor Corp.' },
			PayTypeText: { value: 8, label: 'Expense Reimbursement' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: 1000, label: 'Hourly' },
			RegHrs: true,
			OTHrs: true,
			DTHrs: true,
			TotalAmount: false,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: 4, label: 'Bonus' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: 5, label: 'Holiday' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: 6, label: 'Hazard' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: 7, label: 'Per Diem' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
		{
			AssignmentName: { value: 2, label: 'Unbillable' },
			PayTypeText: { value: 8, label: 'Expense Reimbursement' },
			RegHrs: false,
			OTHrs: false,
			DTHrs: false,
			TotalAmount: true,
		},
	]);
