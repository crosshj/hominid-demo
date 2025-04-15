/*
	run:
		nodemon -r dotenv/config store/Data.test.mjs
*/

import { read } from './Data.js';

const clientRequestorToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMEE4MTQxLThBREMtNEYwMC1CMDJFLTJCRDRBNjdFRUU2RiIsImVtYWlsIjoiYXR3b3Jrcm9sZStyZXF1ZXN0Q2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiUmVxdWVzdG9yIiwicm9sZSI6NSwiYnJhbmNoSWQiOjEsInRlbmFudElkIjoxfQ.zLv-VtTF-JcFuzxwLqaWmn9gP2AhOUb1JKqXeSOFehA';

const clientApproverToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwRjQ1QUExLURFRjItNEVFMi04Q0Q1LTIyRjY4MUM0QzVBRSIsImVtYWlsIjoiYXR3b3Jrcm9sZSthcHByb3ZlQ2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiQXBwcm92ZXIiLCJyb2xlIjoyLCJicmFuY2hJZCI6MSwidGVuYW50SWQiOjJ9.Oofg_7lwUVt5l4F9_0NQ2eBtjWLNWvkPM2KAeVYqnhI';

const input = [
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'getInvoiceById',
	// 	args: JSON.stringify({
	// 		id: 2,
	// 	}),
	// },
	{
		uuid: '28902902',
		name: 'listView',
		args: JSON.stringify({
			token: clientApproverToken,
			key: 'sp_PayrollBillingApprovalsNeededByDate',
			StartDT: '1/2/1950',
			EndDT: '2/5/2023',
		}),
	},
];

const ctx = {};
const results = await read({ input, ctx });

//TODO: this should be a test
