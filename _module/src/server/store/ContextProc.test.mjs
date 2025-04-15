/*
	run:
		nodemon -r dotenv/config store/ContextProc.test.mjs
*/

import { read } from './ContextProc.js';

const clientRequestorToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMEE4MTQxLThBREMtNEYwMC1CMDJFLTJCRDRBNjdFRUU2RiIsImVtYWlsIjoiYXR3b3Jrcm9sZStyZXF1ZXN0Q2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiUmVxdWVzdG9yIiwicm9sZSI6NSwiYnJhbmNoSWQiOjEsInRlbmFudElkIjoxfQ.zLv-VtTF-JcFuzxwLqaWmn9gP2AhOUb1JKqXeSOFehA';

const clientApproverToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwRjQ1QUExLURFRjItNEVFMi04Q0Q1LTIyRjY4MUM0QzVBRSIsImVtYWlsIjoiYXR3b3Jrcm9sZSthcHByb3ZlQ2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiQXBwcm92ZXIiLCJyb2xlIjoyLCJicmFuY2hJZCI6MSwidGVuYW50SWQiOjJ9.Oofg_7lwUVt5l4F9_0NQ2eBtjWLNWvkPM2KAeVYqnhI';

const input = [
	// {
	// 	uuid: '20020202-20202-20202',
	// 	name: 'ui.sp_UIContextGetComponentsByUserID',
	// 	args: JSON.stringify({
	// 		//key: 'clientEdit',
	// 		key: 'prospectDetail',
	// 		//key: 'root',
	// 		//key: 'root.clients',
	// 		//key: 'clientOrSubsite',
	// 		token: clientRequestorToken,
	// 		//token: clientApproverToken,
	// 		//token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwRjQ1QUExLURFRjItNEVFMi04Q0Q1LTIyRjY4MUM0QzVBRSIsImVtYWlsIjoiYXR3b3Jrcm9sZSthcHByb3ZlQ2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiQXBwcm92ZXIiLCJyb2xlIjoyLCJicmFuY2hJZCI6MSwidGVuYW50SWQiOjJ9.Oofg_7lwUVt5l4F9_0NQ2eBtjWLNWvkPM2KAeVYqnhI',
	// 	}),
	// 	//args: '{"key":"root.clients","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwRjQ1QUExLURFRjItNEVFMi04Q0Q1LTIyRjY4MUM0QzVBRSIsImVtYWlsIjoiYXR3b3Jrcm9sZSthcHByb3ZlQ2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiQXBwcm92ZXIiLCJyb2xlIjoyLCJicmFuY2hJZCI6MSwidGVuYW50SWQiOjJ9.Oofg_7lwUVt5l4F9_0NQ2eBtjWLNWvkPM2KAeVYqnhI"}',
	// },
	////EXEC ui.sp_UIContextGetComponentsByUserID 'invoices', '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F', 1, 1, 1
	// {
	// 	uuid: '20020202-20202-20202',
	// 	name: 'ui.sp_UIContextGetComponentsByUserID',
	// 	args: JSON.stringify({
	// 		//key: 'clientEdit',
	// 		key: 'prospectCreate',
	// 		user: {
	// 			id: '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F',
	// 		},
	// 		branchID: {
	// 			id: '1',
	// 		},
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'prospectCreate',
	// 		itemId: '69',
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'prospectSkillsNeeded',
	// 		itemId: '69',
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_GetOptionLists',
	// 	args: JSON.stringify({
	// 		key: 'Skills',
	// 		token: clientRequestorToken,
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'prospectContacts',
	// 	}),
	// },
	// {
	// 	uuid: '20020202-20202-20202',
	// 	name: 'ui.sp_UIContextGetComponentsByUserID',
	// 	args: JSON.stringify({
	// 		key: 'branchClientsSearchable',
	// 		user: {
	// 			id: '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F',
	// 		},
	// 		branch: {
	// 			id: '1',
	// 		},
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'branchClientsSearchable',
	// 	}),
	// },
	//EXEC ui.sp_formElementsGetbyFormKey 'viewInvoice', 1, 18
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'viewInvoice',
	// 		//itemId: '18',
	// 	}),
	// },
	// @params
	//
	// SELECT * FROM
	//EXEC ui.sp_formElementsGetbyFormKey 'prospectCreate'
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		//key: 'prospectEdit',
	// 		key: 'activationRequest',
	// 		token: clientRequestorToken,
	// 		itemId: '104',
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_UIContextGetComponentsByUserID',
	// 	args: JSON.stringify({
	// 		key: 'clientEdit',
	// 		user: {
	// 			id: '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F',
	// 		},
	// 		branch: {
	// 			id: '1',
	// 		},
	// 	}),
	// },
	// 'dbo.sp_BranchClientContactsGetAllByBranchClientID'
	{
		uuid: '30030303-30303-30303',
		name: 'ui.sp_formElementsGetbyFormKey',
		args: JSON.stringify({
			//key: 'BranchClientContacts',
			key: 'prospectContacts',
			itemId: '89',
			token: clientRequestorToken,
		}),
	},
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'clientCreateSubSite',
	// 		itemId: '69',
	// 	}),
	// },
	// //EXEC ui.sp_formElementsGetbyFormKey 'prospectCreate'
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'prospectSkillsCreate',
	// 	}),
	// },
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'activationRequest',
	// 		//itemId: 105,
	// 		//itemId: undefined,
	// 		token: clientRequestorToken,
	// 	}),
	// },
	// //EXEC ui.sp_formElementsGetbyFormKey 'prospectCreate'
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_formElementsGetbyFormKey',
	// 	args: JSON.stringify({
	// 		key: 'prospectContactsCreate',
	// 	}),
	// },
	// //EXEC ui.sp_GetOptionLists 'branchStaff', BranchID
	// {
	// 	uuid: '30030303-30303-30303',
	// 	name: 'ui.sp_GetOptionLists',
	// 	args: JSON.stringify({
	// 		key: 'branchStaff',
	// 		BranchID: 3,
	// 	}),
	// },
];

const ctx = {};
const results = await read({ input, ctx });

//TODO: this should be an integration test
