jest.mock('../integrations/database');
jest.mock('../integrations/auth0');
// jest.mock('../store/notes');

xdescribe('user', () => {
	const { handler } = require('../graphql');
	const config = { cors: { allowed: [] } };
	const doQuery = require('./helpers/doQuery')(handler(config));

	it('should return user for a customer', async () => {
		const queryJSON = {
			operationName: 'getUser',
			query: `
				query getUser($input: UserInput){
					user(input: $input){
						roles {
							type
							value
						}
					}
				}`,
			variables: {
				input: {},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedCustomer',
		};
		const { data, error } = await doQuery(queryJSON, headers);

		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('CUSTOMER');
		expect(roles[0].value).toBe('86');
	});

	it('should return user for a Site Admin', async () => {
		const queryJSON = {
			operationName: 'getUser',
			query: `
				query getUser($input: UserInput){
					user(input: $input){
						roles {
							type
							value
						}
					}
				}`,
			variables: {
				input: {},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedSiteAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('SITEADMIN');
		expect(roles[0].value).not.toBeTruthy();
	});

	it('should return user for an Local Office Admin', async () => {
		const queryJSON = {
			operationName: 'getUser',
			query: `
				query getUser($input: UserInput){
					user(input: $input){
						roles {
							type
							value
						}
					}
				}`,
			variables: {
				input: {},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedLocalOfficeAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('LOCALOFFICEADMIN');
		expect(roles[0].value).toBe('75');
	});

	it('should connect an Auth0 user to local office using invite', async () => {
		const queryJSON = {
			operationName: 'acceptUserInvite',
			query: `
				mutation acceptUserInvite($input: UserInput){
					user(input: $input){
						id
						first
						last
						email
						roles {
							type
							value
						}
					}
				}`,
			variables: {
				input: {
					inviteCode: '5dcb6a9958e44d6977434faa1905dd78',
				},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedUnregisteredLocalOfficeAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('LOCALOFFICEADMIN');
		expect(roles[0].value).toBe('234');
	});

	it('should create a customer user, including customer record', async () => {
		const queryJSON = {
			operationName: 'createUser',
			query: `
				mutation createUser($input: UserInput) {
					user(input: $input){
						roles {
							type
							value
						}
					}
				}
			`,
			variables: {
				input: {
					first: 'New',
					last: 'Customer',
					email: 'newCustomer@test.com',
					address: {
						zip: '86753',
					},
					roles: [
						{
							type: 'CUSTOMER',
						},
					],
				},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedNewCustomer',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('CUSTOMER');
		expect(roles[0].value).toBe('5');
	});

	it('should create a guest customer user, including customer record', async () => {
		const queryJSON = {
			operationName: 'createUser',
			query: `
				mutation createUser($input: UserInput) {
					user(input: $input){
						roles {
							type
							value
						}
					}
				}
			`,
			variables: {
				input: {
					first: 'Guest',
					last: 'Customer',
					email: 'guestCustomer@test.com',
					address: {
						zip: '86753',
					},
					roles: [
						{
							type: 'CUSTOMER',
						},
					],
				},
			},
		};
		const { data, error } = await doQuery(queryJSON);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('CUSTOMER');
		expect(roles[0].value).toBe('5');
	});

	it('should create a site admin user', async () => {
		const queryJSON = {
			operationName: 'createUser',
			query: `
				mutation createUser($input: UserInput) {
					user(input: $input){
						roles {
							type
							value
						}
					}
				}
			`,
			variables: {
				input: {
					first: 'New',
					last: 'Site Admin',
					email: 'siteAdmin@test.com',
					roles: [
						{
							type: 'SITEADMIN',
						},
					],
				},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedSiteAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('SITEADMIN');
		expect(roles[0].value).not.toBeTruthy();
	});
	it('should create an LO admin user when local office id is provided', async () => {
		const queryJSON = {
			operationName: 'createUser',
			query: `
				mutation createUser($input: UserInput) {
					user(input: $input){
						roles {
							type
							value
						}
					}
				}
			`,
			variables: {
				input: {
					first: 'New Local',
					last: 'Office Admin',
					email: 'localOfficeAdmin@test.com',
					roles: [
						{
							type: 'LOCALOFFICEADMIN',
							value: '150',
						},
					],
				},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedSiteAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		const { roles } = data.user[0];
		expect(roles[0].type).toEqual('LOCALOFFICEADMIN');
		expect(roles[0].value).toBe('150');
	});
	it('should error on creating an LO admin user when no LO id given', async () => {
		const queryJSON = {
			operationName: 'createUser',
			query: `
				mutation createUser($input: UserInput) {
					user(input: $input){
						roles {
							type
							value
						}
					}
				}
			`,
			variables: {
				input: {
					first: 'New Local',
					last: 'Office Admin',
					email: 'localOfficeAdmin@test.com',
					roles: [
						{
							type: 'LOCALOFFICEADMIN',
						},
					],
				},
			},
		};
		const headers = {
			Authorization: 'Bearer MockedSiteAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error[0]).toBe(
			'Cannot create LO Admin. LO Role provided without value.'
		);
		expect(data).toBeUndefined();
	});
});
