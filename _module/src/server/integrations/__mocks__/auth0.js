const getUser = jest.fn(async (request) => {
	const { headers } = request;
	if (headers?.Authorization === 'Bearer MockedSiteAdmin')
		return {
			sub: 'auth0|siteadmin',
		};
	if (headers?.Authorization === 'Bearer MockedCustomer')
		return {
			sub: 'auth0|customer',
		};
	if (headers?.Authorization === 'Bearer MockedLocalOfficeAdmin')
		return {
			sub: 'auth0|localofficeadmin',
		};
	if (headers?.Authorization === 'Bearer MockedUnregisteredLocalOfficeAdmin')
		return {
			sub: 'auth0|newlocalofficeadmin',
		};
	if (headers?.Authorization === 'Bearer MockedNewCustomer') {
		return {
			email: 'newCustomer@test.com',
			email_verified: false,
			name: 'newCustomer@test.com',
			nickname: 'anthrondp+local',
			picture:
				'https://s.gravatar.com/avatar/1a606437a7e9047acd7bbaa063668f73?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fnc.png',
			sub: 'auth0|newCustomer',
			updated_at: '2022-01-21T19:36:49.363Z',
		};
	}
	return {};
});

module.exports = { getUser };
