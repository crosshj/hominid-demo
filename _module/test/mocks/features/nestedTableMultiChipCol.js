const { faker } = require('@faker-js/faker');
const { DRIVERS } = require('mssql');

const mock = [
	{
		positionName: 'CDLA Truck Driver',
		positionReq: 'CDL license',
		positionDesc: 'Must have CDL',
	},
	{
		positionName: 'CDLA Truck Driver',
		positionReq: 'drug screen',
		positionDesc: 'Must take drug screen',
	},
	{
		positionName: 'Forklift Operator',
		positionReq: 'forklift license',
		positionDesc: 'Must have Forklift License',
	},
	{
		positionName: 'Forklift Operator',
		positionReq: 'Drug Screen',
		positionDesc: 'Must take drug screen',
	},
	{
		positionName: 'Assembly Worker',
		positionReq: 'high school diploma',
		positionDesc: 'Must have HS diploma',
	},
	{
		positionName: 'Assembly Worker',
		positionReq: 'Drug Screen',
		positionDesc: 'Must take drug screen',
	},
	{
		positionName: 'Assembly Worker',
		positionReq: 'Equipment',
		positionDesc: 'Must have proper guages',
	},
	{
		positionName: 'Intern',
		positionReq: '',
		positionDesc: 'Blah blah...',
	},
];

module.exports = (args, query, session) => {
	//if (args?.itemId) return;
	return JSON.stringify(mock);
};
