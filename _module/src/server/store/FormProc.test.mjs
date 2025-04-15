/*
	run:
		nodemon -r dotenv/config store/FormProc.test.mjs
*/

import { write } from './FormProc.js';

const clientRequestorToken =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAwMEE4MTQxLThBREMtNEYwMC1CMDJFLTJCRDRBNjdFRUU2RiIsImVtYWlsIjoiYXR3b3Jrcm9sZStyZXF1ZXN0Q2xpZW50QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNsaWVudCIsImxhc3ROYW1lIjoiUmVxdWVzdG9yIiwicm9sZSI6NSwiYnJhbmNoSWQiOjEsInRlbmFudElkIjoyfQ.RTBn460qMBq0H3S5MldC5rVwHXdmlJMj2e1jmJGHSCU';

const input = [
	//EXEC dbo.sp_InvoiceDetailsUpdate
	// {
	// 	uuid: '40040404-40404-40404',
	// 	name: 'dbo.sp_InvoiceDetailsUpdate',
	// 	args: JSON.stringify({
	// 		clientname: 'sampleclient-HARRISON_CHANGE',
	// 		clientid: '1234',
	// 		clientemail: 'jason@anthroware.com',
	// 		clientphone: '(707) 540-5685',
	// 		subsitename: 'la casa de los pollos hermanos',
	// 		branchclientid: '18',
	// 	}),
	// },
	// EXEC dbo.sp_BranchClientCreateNew
	// {
	// 	uuid: '60060606-60606-60606',
	// 	name: 'dbo.sp_BranchClientsCreateNew',
	// 	args: JSON.stringify({
	// 		userID: '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F',
	// 		ClientName: 'ABIMA ACTIVE 1',
	// 		PrimaryPhone: '867-5309',
	// 		SalesPersonID: '0',
	// 		BranchID: '3',
	// 		BecameProspectDT: new Date().toISOString(),
	// 		ClientActivationDT: new Date().toISOString(),
	// 	}),
	// },
	//  <<<<<<<<<< MANUALLY
	// {
	// 	uuid: '70070707-70707-70707',
	// 	name: 'dbo.sp_BranchClientContactsCreateNew',
	// 	args: JSON.stringify({}),
	// },
	// EXEC dbo.sp_BranchClientUpdate
	// {
	// 	uuid: '60060606-60606-60606',
	// 	name: 'dbo.sp_BranchClientsUpdate',
	// 	args: JSON.stringify({
	// 		userID: '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F',
	// 		ClientName: 'Craig',
	// 		ClientIdent: 69,
	// 		PrimaryPhone: '867-5309',
	// 		SalesPersonID: '009C14C0-6F88-4828-8059-29E1453D830C',
	// 		BranchID: 3,
	// 		BecameProspectDT: '2022-09-15T18:12:42.577Z',
	// 		ClientActivationDT: '',
	// 		Website: 'harrison.client@update.com',
	// 	}),
	// },
	// EXEC dbo.sp_BranchClientSkillsUpsert
	// {
	// 	uuid: '70070707-70707-70707',
	// 	name: 'dbo.sp_BranchClientSkillsUpsert',
	// 	args: JSON.stringify({
	// 		skills: '4,56,76,88',
	// 	}),
	// },
	// EXEC dbo.sp_BranchClientContactsCreateNew
	// {
	// 	uuid: '80080808-80808-80808',
	// 	name: 'dbo.sp_BranchClientContactsCreateNew',
	// 	args: JSON.stringify({
	// 		FirstName: 'New',
	// 		LastName: 'ClientContact',
	// 		Phone: '555-555-5555',
	// 		EmailAddress: 'new@client.com',
	// 		Role: 'Owner',
	// 		Department: 'Product',
	// 	}),
	// },
	// EXEC dbo.sp_BranchClientRequestActivation
	// {
	// 	uuid: '80080808-80808-80808',
	// 	name: 'dbo.sp_BranchClientRequestActivation',
	// 	args: JSON.stringify({
	// 		token: clientRequestorToken,
	// 		BranchClientID: '105',
	// 		ClientName: '',
	// 		PrimaryPhone: '',
	// 		PrimaryEmailAddress: '',
	// 		Website: '',
	// 		CreditLimit: '',
	// 		WorkCompDetails: '',
	// 		ACASurchargeMethodID: '',
	// 		ACASurchargeRate: 0,
	// 		ACAInvoiceFormat: '',
	// 		ACABillInsuredOnly: '',
	// 		InvoiceFormat: '',
	// 		InvoiceTerms: 1,
	// 		MailInvoice: '',
	// 		DiscountPct: '0',
	// 		SalesTaxPct: '0',
	// 	}),
	// },
	//dbo.sp_BranchClientWCCodesUpsert
	// {
	// 	name: 'dbo.sp_BranchClientsCreateNew',
	// 	uuid: '',
	// 	args: JSON.stringify({
	// 		token: clientRequestorToken,
	// 		ClientName: 'Test skills',
	// 		//ClientIdent: 'Assigned upon Save',
	// 		PrimaryPhone: '',
	// 		SalesPersonID: '0DE5EC87-4D9A-482E-B8E8-9E4297406CB5',
	// 		BranchID: '3',
	// 	}),
	// },
	// {
	// 	name: 'dbo.sp_BranchClientSkillsUpsert',
	// 	uuid: '',
	// 	args: JSON.stringify({
	// 		token: clientRequestorToken,
	// 		SkillID: '40',
	// 	}),
	// },
	// {
	// 	name: 'dbo.sp_BranchClientsCreateNew',
	// 	uuid: '',
	// 	args: JSON.stringify({
	// 		ClientName: 'Test skills',
	// 		//ClientIdent: 'Assigned upon Save',
	// 		PrimaryPhone: '',
	// 		SalesPersonID: '',
	// 		BranchID: '',
	// 		token: clientRequestorToken,
	// 	}),
	// },
	// {
	// 	name: 'dbo.sp_BranchClientSkillsUpsert',
	// 	uuid: '',
	// 	args: JSON.stringify({
	// 		value: '40',
	// 		token: clientRequestorToken,
	// 	}),
	// },
	// {
	// 	name: 'dbo.sp_BranchClientSkillsUpsert',
	// 	uuid: '',
	// 	args: JSON.stringify({
	// 		value: '141',
	// 		token: clientRequestorToken,
	// 	}),
	// },
];

const ctx = {};
const results = await write({ input, ctx });

//TODO: this should be a test
