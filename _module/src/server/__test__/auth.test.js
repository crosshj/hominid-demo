jest.mock('../integrations/database');
jest.mock('../integrations/auth0');
// jest.mock('../store/notes');

xdescribe('authentication and authorization', () => {
	const { handler } = require('../graphql');
	const config = { cors: { allowed: [] } };
	const doQuery = require('./helpers/doQuery')(handler(config));

	it('should use auth when calling some query', async () => {
		const query = `
		query getBrandedMedia($input: MediaSearchInput){
			media(input: $input){
				id
				createdDate
			}
		}`;
		const queryJSON = {
			operationName: 'getBrandedMedia',
			variables: { input: {} },
			query,
		};
		const headers = {
			Authorization: 'Bearer MockedLocalOfficeAdmin',
		};
		const { data, error } = await doQuery(queryJSON, headers);
		expect(error).toBeUndefined();
		// because 4 realtors exist in mock
		expect(data.media.length).toBe(3);
	});
});
