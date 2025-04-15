/*
	run:
		nodemon -r dotenv/config store/ContextProc.test.mjs
*/

import { read } from './ListProc.js';

const clientRequestorToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMEE4MTQxLThBREMtNEYwMC1CMDJFLTJCRDRBNjdFRUU2RiIsImVtYWlsIjoiYXR3b3Jrcm9sZStyZXF1ZXN0Q2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiUmVxdWVzdG9yIiwicm9sZSI6NSwiYnJhbmNoSWQiOjEsInRlbmFudElkIjoyfQ.RTBn460qMBq0H3S5MldC5rVwHXdmlJMj2e1jmJGHSCU';

const clientApproverToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwRjQ1QUExLURFRjItNEVFMi04Q0Q1LTIyRjY4MUM0QzVBRSIsImVtYWlsIjoiYXR3b3Jrcm9sZSthcHByb3ZlQ2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiQXBwcm92ZXIiLCJyb2xlIjoyLCJicmFuY2hJZCI6MSwidGVuYW50SWQiOjJ9.Oofg_7lwUVt5l4F9_0NQ2eBtjWLNWvkPM2KAeVYqnhI';

const input = [
	//EXEC ui.sp_UIContextGetComponentsByUserID 'invoices', '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F', 1, 1, 1
	// {
	// 	uuid: '20020202-20202-20202',
	// 	name: 'ui.sp_GetResourceListViews',
	// 	args: JSON.stringify({
	// 		key: 'PrebillReportByBranch',
	// 	}),
	// },
	// {
	// 	uuid: '20020202-20202-20202',
	// 	name: 'ui.sp_GetResourceListViews',
	// 	args: JSON.stringify({
	// 		key: 'BranchClients',
	// 		token: clientRequestorToken,
	// 		//branchId: '3',
	// 	}),
	// },
	// {
	// 	uuid: '20020202-20202-20202',
	// 	name: 'ui.sp_GetResourceListViews',
	// 	args: JSON.stringify({
	// 		key: 'branchclientsSearchable',
	// 		token: clientRequestorToken,
	// 		//branchId: '3',
	// 	}),
	// },
	{
		uuid: '20020202-20202-20202',
		name: 'ui.sp_GetResourceListViews',
		args: JSON.stringify({
			key: 'branchclients',
			//key: 'ChildClientsPendingActivation',
			//key: 'ChildClients',
			// token: clientApproverToken,
			token: clientRequestorToken,
		}),
	},
];

const ctx = {};
const results = await read({ input, ctx });

//TODO: this should be a proper test
