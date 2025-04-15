require('dotenv').config();
const { execDB, readDB, close: closeDB } = require('../integrations/database');
const session = require('../store/Session.js');

describe('Database Integration', () => {
	beforeAll(() => {
		process.env.ISLOCAL = true;
		jest.setTimeout(30000);
	});

	afterAll(() => {
		closeDB();
	});

	xit('should handle a basic case', async () => {
		const procName = `process.sp_WorkflowStateGetTreeByProcessNameControlID`;
		const procArgs = {
			processName: 'Pay',
			controlID: 83,
			branchID: session.users[0].branchId,
			userID: session.users[0].id,
		};
		const results = await execDB(procName, procArgs);
		console.log({ results });
	});

	xit('should get a user using auth0 id', async () => {
		const procName = `dbo.sp_UsersGetUserByAuthID`;
		const procArgs = { authID: '64f9f9a7bedc3b0e98957911' };
		//const procArgs = { authID: '64022098e51f34ad59ae66d9' };
		const results = await execDB(procName, procArgs);
		console.log({ results });
	});

	xit('should accept an invite', async () => {
		const procName = `dbo.sp_UserAcceptInvite`;
		const procArgs = {
			token: 'CBCC0329-374F-4C1A-9D87-B8B2ABA362B4',
			auth0ID: '64fa416c431b372a125eb27e',
		};
		const results = await execDB(procName, procArgs);
		const status = results?.[1]?.[0]?.result;
		console.log(JSON.stringify({ status }));
	});

	xit('get clients', async () => {
		const procName = `ui.sp_RLVClientsSearchableGetByBranchID`;
		const procArgs = {
			branchID: session.users[0].branchId,
			userID: session.users[0].id,
		};
		const results = await execDB(procName, procArgs);
		console.log({ results });
	});

	it('get a menu for a user', async () => {
		const procName = `ui.sp_UIContextGetComponentsByUserID`;
		const procArgs = {
			branchID: session.users[0].branchId,
			userID: session.users[0].id,
			key: 'root',
			TraverseDown: 1,
			Lang: 1,
		};
		const results = await execDB(procName, procArgs);
		console.log({ results });
	});

	xit('list all tables in DB', async () => {
		const results = await readDB({
			query: 'SELECT name FROM sys.objects',
		});
		console.log({ results });
	});
});
