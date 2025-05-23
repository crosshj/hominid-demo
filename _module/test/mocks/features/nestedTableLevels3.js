const { faker } = require('@faker-js/faker');

const mock = [
	{
		ordersStatus: 'filled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 1,
		ordersOrderName: 'Order Name #1',
		'ordersShiftID.hidden': 1,
		ordersShiftName: 'Shift Name #1',
		ordersAssignName: 'Assignment #1',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 3,
		ordersTotal: 12,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
	{
		ordersStatus: 'filled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 1,
		ordersOrderName: 'Order Name #1',
		'ordersShiftID.hidden': 1,
		ordersShiftName: 'Shift Name #1',
		ordersAssignName: 'Assignment #2',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 3,
		ordersTotal: 12,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
	{
		ordersStatus: 'filled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 1,
		ordersOrderName: 'Order Name #1',
		'ordersShiftID.hidden': 2,
		ordersShiftName: 'Shift Name #2',
		ordersAssignName: 'Assignment #1',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 5,
		ordersTotal: 10,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
	{
		ordersStatus: 'partiallyFilled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 1,
		ordersOrderName: 'Order Name #1',
		'ordersShiftID.hidden': 3,
		ordersShiftName: 'Shift Name #3',
		ordersAssignName: 'Assignment #1',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 2,
		ordersTotal: 5,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
	{
		ordersStatus: 'partiallyFilled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 1,
		ordersOrderName: 'Order Name #1',
		'ordersShiftID.hidden': 3,
		ordersShiftName: 'Shift Name #3',
		ordersAssignName: 'Assignment #2',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 2,
		ordersTotal: 5,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
	{
		ordersStatus: 'partiallyFilled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 1,
		ordersOrderName: 'Order Name #1',
		'ordersShiftID.hidden': 3,
		ordersShiftName: 'Shift Name #3',
		ordersAssignName: 'Assignment #3',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 2,
		ordersTotal: 5,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
	{
		ordersStatus: 'unfilled',
		'ordersTenantBranchID.hidden': 1,
		ordersBranchName: 'Haag and Sons',
		ordersBranchStatus: 'partiallyFilled',
		ordersOrderStatus: 'partiallyFilled',
		ordersShiftStatus: 'partiallyFilled',
		'ordersOrderID.hidden': 2,
		ordersOrderName: 'Order Name #2',
		'ordersShiftID.hidden': 3,
		ordersShiftName: 'Shift Name #1',
		ordersAssignName: 'Assignment #1',
		ordersStartDate: faker.date.recent(),
		ordersClientName: faker.company.name(),
		ordersUnfilled: 5,
		ordersTotal: 12,
		ordersBillRate: faker.finance.amount(),
		ordersMargin: faker.finance.amount(),
		ordersPayRate: faker.finance.amount(),
	},
];

module.exports = (args, query, session) => {
	//if (args?.itemId) return;
	return JSON.stringify(mock);
};
