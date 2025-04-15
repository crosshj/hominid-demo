const { execDB } = require('../integrations/database');
const jwt = require('jwt-simple');
const secret = 'xxx';

const UserTransform = (user) => {
	const { id, email, firstName, lastName } = user;
	const token = jwt.encode(user, secret);
	const transformed = { id, email, firstName, lastName, token };
	return transformed;
};

const DBUserTransform = (dbUser, roleIndex) => {
	try {
		const firstResult = dbUser[0];
		if (typeof firstResult === 'undefined') return;
		const {
			userID: id = '',
			emailAddress: email = '',
			firstName = '',
			lastName = '',
			rolesConfig = '[]',
		} = firstResult || {};
		const roles = JSON.parse(rolesConfig);
		const {
			branchID: branchId,
			roleID: roleId,
			tenantID: tenantId,
		} = roles[roleIndex] || {};
		return UserTransform({
			id,
			email,
			firstName,
			lastName,
			branchId,
			roleId,
			tenantId,
		});
	} catch (e) {}
};

const users = [
	{
		id: '00F45AA1-DEF2-4EE2-8CD5-22F681C4C5AE',
		email: 'atworkrole+parent@gmail.com',
		firstName: 'Parent',
		lastName: 'Tenant',
		role: 2,
		branchId: 3,
		tenantId: 2,
	},
	{
		id: '000A8141-8ADC-4F00-B02E-2BD4A67EEE6F',
		email: 'atworkrole+child@gmail.com',
		firstName: 'Child',
		lastName: 'Tenant',
		role: 5,
		branchId: 1,
		tenantId: 1,
	},
	{
		id: '',
		email: 'atworkrole+talent@gmail.com',
		firstName: 'Talent',
		lastName: 'Talent',
		role: 7,
		branchId: 1,
		tenantId: 1,
	},
	{
		id: '',
		email: 'atworkrole+client@gmail.com',
		firstName: 'Client',
		lastName: 'Client',
		role: 8,
		branchId: 1,
		tenantId: 1,
	},
];

const read = async ({ input, ctx }) => {
	const { email, id: auth0ID, invite: token } = input;

	//FIRST: attempt to get user from DB
	const userFromDB = await execDB('dbo.sp_UsersGetUserByAuthID', {
		authID: auth0ID,
	});
	const roleIndex = 0; //TODO
	const userFromDBMapped = DBUserTransform(userFromDB, roleIndex);
	if (typeof userFromDBMapped !== 'undefined') return userFromDBMapped;

	//BUT: if an invite exists, then accept it
	if ([auth0ID, token].every((x) => typeof x !== 'undefined')) {
		const results = await execDB('dbo.sp_UserAcceptInvite', {
			token,
			auth0ID,
		});
		const status = results?.[1]?.[0]?.result;
		const statusMapped =
			{
				0: 'success',
				2: 'already accepted',
				3: 'expired',
				4: 'invalid token',
			}[status] || `unknown status [${status}]`;
		console.info(`On invite accept: ${token}, status: ${statusMapped}`);
	}
};

module.exports = {
	users,
	read,
};
