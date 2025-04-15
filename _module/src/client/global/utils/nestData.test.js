import { nestData } from './nestData';

const testData = [
	{
		achProcessingid: 1,
		'achProcessingBranchClientID.hidden': 2,
		'achProcessingTenantID.hidden': 1,
		achProcessingGrandTotal: 'Grand Total',
		achProcessingStatus: 'Active',
		achProcessingEmployeeType: 'Talent',
		achProcessingEmployeeName: 'Arty Charles Hopper',
		achProcessingSocialSecurityNumber: 'xxx-xx-xxxx',
		achProcessingDirectDepositNumber: '933519',
		achProcessingBankCode: '10',
		achProcessingRoutingNumber: '674163454',
		achProcessingBankAccountNumber: '30996518',
		achProcessingTenant: 'Tenant A',
		achProcessingNetPay: '115',
	},
	{
		achProcessingid: 2,
		'achProcessingBranchClientID.hidden': 2,
		'achProcessingTenantID.hidden': 1,
		achProcessingGrandTotal: 'Grand Total',
		achProcessingStatus: 'Active',
		achProcessingEmployeeType: 'Talent',
		achProcessingEmployeeName: 'Andy Cane Hand',
		achProcessingSocialSecurityNumber: 'xxx-xx-xxxx',
		achProcessingDirectDepositNumber: '530415',
		achProcessingBankCode: '76',
		achProcessingRoutingNumber: '030396166',
		achProcessingBankAccountNumber: '49711918',
		achProcessingTenant: 'Tenant A',
		achProcessingNetPay: '115',
	},
	{
		achProcessingid: 1,
		'achProcessingBranchClientID.hidden': 2,
		'achProcessingTenantID.hidden': 1,
		achProcessingGrandTotal: 'Grand Total',
		achProcessingStatus: 'Active',
		achProcessingEmployeeType: 'Talent',
		achProcessingEmployeeName: 'Arty Charles Hopper',
		achProcessingSocialSecurityNumber: 'xxx-xx-xxxx',
		achProcessingDirectDepositNumber: '933519',
		achProcessingBankCode: '10',
		achProcessingRoutingNumber: '674163454',
		achProcessingBankAccountNumber: '30996518',
		achProcessingTenant: 'Tenant B',
		achProcessingNetPay: '261',
	},
	{
		achProcessingid: 2,
		'achProcessingBranchClientID.hidden': 2,
		'achProcessingTenantID.hidden': 1,
		achProcessingGrandTotal: 'Grand Total',
		achProcessingStatus: 'Active',
		achProcessingEmployeeType: 'Talent',
		achProcessingEmployeeName: 'Andy Cane Hand',
		achProcessingSocialSecurityNumber: 'xxx-xx-xxxx',
		achProcessingDirectDepositNumber: '530415',
		achProcessingBankCode: '76',
		achProcessingRoutingNumber: '030396166',
		achProcessingBankAccountNumber: '49711918',
		achProcessingTenant: 'Tenant B',
		achProcessingNetPay: '261',
	},
];

describe('nest data', () => {
	it('nesting one level', async () => {
		const nestedData = nestData({
			data: testData.slice(0, 2),
			params: ['achProcessingBranchClientID.hidden'],
			names: ['achProcessingGrandTotal'],
		});
		expect(nestedData.length).toEqual(1);
		expect(nestedData[0].name).toEqual('Grand Total');
		expect(nestedData[0].children.length).toEqual(2);
		expect(nestedData[0].children[0].children).toBeUndefined();
		expect(nestedData[0].children[1].children).toBeUndefined();
	});
	it('nesting two levels', async () => {
		const nestedData = nestData({
			data: testData.slice(0, 2),
			params: ['achProcessingBranchClientID.hidden', 'achProcessingid'],
			names: ['achProcessingGrandTotal', 'achProcessingEmployeeName'],
		});
		expect(nestedData.length).toEqual(1);
		expect(nestedData[0].name).toEqual('Grand Total');
		expect(nestedData[0].children.length).toEqual(2);
		expect(nestedData[0].children[0].children.length).toEqual(1);
		expect(nestedData[0].children[1].children.length).toEqual(1);
	});
	it('nesting for totals only', async () => {
		const nestedData = nestData({
			data: testData.slice(0, 2),
			params: '*',
			names: ['Grand Total'],
		});
		expect(nestedData.length).toEqual(1);
		expect(nestedData[0].name).toEqual('Grand Total');
		expect(nestedData[0].children.length).toEqual(2);
		expect(nestedData[0].children[0].children.length).toEqual(1);
		expect(nestedData[0].children[1].children.length).toEqual(1);
	});
	it('nesting three levels', async () => {
		const nestedData = nestData({
			data: testData,
			params: [
				'achProcessingBranchClientID.hidden',
				'achProcessingid',
				'achProcessingTenant',
			],
			names: [
				'achProcessingGrandTotal',
				'achProcessingEmployeeName',
				'achProcessingTenant',
			],
		});
		expect(nestedData.length).toEqual(1);
		expect(nestedData[0].name).toEqual('Grand Total');
		expect(nestedData[0].children.length).toEqual(2);
		expect(nestedData[0].children[0].children.length).toEqual(2);
		expect(nestedData[0].children[1].children.length).toEqual(2);
	});
	it('nesting three levels', async () => {
		const nestedData = nestData({
			data: testData,
			params: '*',
			names: ['foo'],
		});

		//all nest ids are unique
		const allNestIds = JSON.stringify(nestedData, null, 2)
			.split('\n')
			.filter((x) => x.includes('_nestId'))
			.map((x) => JSON.parse(`{${x}"_":0}`)._nestId);
		expect(Array.from(new Set(allNestIds)).length).toBe(allNestIds.length);

		//these nestId's exactly equal
		expect(allNestIds).toEqual([
			'nest-1211222232',
			'nest--501660347',
			'nest--555219048',
			'nest--548947251',
			'nest--575542476',
		]);

		//some nest id's are defined
		expect(nestedData[0]._nestId).toBeDefined();
		expect(nestedData[0].children[0]._nestId).toBeDefined();
	});
});
