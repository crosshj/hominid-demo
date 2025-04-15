const { readDB: databaseExec } = require('../integrations/database');
const { pipe } = require('../helpers/utils');
const {
	quoteWrap,
	SQLDate,
	fromSQLDate,
	whereClause,
	insertQuery,
} = require('../helpers/sql');

const inviteStore = require('./invite');

const isSiteAdmin = ({ type }) => type === 'SITEADMIN';
const isLOAdmin = ({ type }) => type === 'LOCALOFFICEADMIN';
const isCustomer = ({ type }) => type === 'CUSTOMER';

const fromDBUser = (userRoles) => {
	const users = {};
	for (var u of userRoles) {
		const {
			UserID,
			RoleName,
			FirstName,
			LastName,
			EmailAddress,
			CustomerIDIfApplicable,
			LocalOfficeIDIfApplicable,
			PhoneNumber,
			MailingAddress1,
			MailingAddress2,
			MailingCity,
			MailingState,
			MailingZipCode,
			ProfileImgURL,
		} = u;
		users[UserID] = users[UserID] || {
			id: UserID,
			first: FirstName,
			last: LastName,
			email: EmailAddress,
			phone: PhoneNumber || '',
			image: ProfileImgURL ? ProfileImgURL : '',
		};
		if (MailingAddress1) {
			users[UserID].address = users[UserID].address || {};
			users[UserID].address.street1 = MailingAddress1;
		}
		if (MailingAddress2) {
			users[UserID].address = users[UserID].address || {};
			users[UserID].address.street2 = MailingAddress2;
		}
		if (MailingCity) {
			users[UserID].address = users[UserID].address || {};
			users[UserID].address.city = MailingCity;
		}
		if (MailingState) {
			users[UserID].address = users[UserID].address || {};
			users[UserID].address.state = MailingState;
		}
		if (MailingZipCode) {
			users[UserID].address = users[UserID].address || {};
			users[UserID].address.zip = MailingZipCode;
		}
		const type = (RoleName || '').toUpperCase();
		let value = '';
		if (type === 'CUSTOMER') {
			value = CustomerIDIfApplicable;
		}
		if (type === 'LOCALOFFICEADMIN') {
			value = LocalOfficeIDIfApplicable;
		}
		users[UserID].roles = users[UserID].roles || [];
		users[UserID].roles.push({
			type,
			value,
		});
	}
	return Object.entries(users).map(([k, v]) => v);
};

const toDBUser = (user) => {
	const { first, last, email, Auth0UserKey } = user;

	const dbUser = {
		FirstName: quoteWrap(first),
		LastName: quoteWrap(last),
		EmailAddress: quoteWrap(email),
		isActive: quoteWrap(true),
		CreatedDT: SQLDate(new Date().toISOString()),
	};
	if (Auth0UserKey) {
		dbUser.Auth0UserKey = quoteWrap(Auth0UserKey);
	}
	return dbUser;
};

const roleIds = {
	SITEADMIN: 1,
	LOCALOFFICEADMIN: 2,
	CUSTOMER: 3,
};
const toDBRoles = (user = {}) => {
	const { id, roles } = user;

	return roles.map((r) => {
		const role = {
			RoleID: quoteWrap(roleIds[r.type]),
			UserID: quoteWrap(id),
			EffectiveStartDT: SQLDate('1900-01-01T00:00:00.000Z'),
			EffectiveEndDT: SQLDate('2030-12-31T00:00:00.000Z'),
		};
		if (isLOAdmin(r)) {
			role.LocalOfficeID = quoteWrap(r.value);
		}
		return role;
	});
};

const toDBUserUpdate = (user = {}) => {
	const dbUpdate = {};
	if (user.Auth0UserKey) {
		dbUpdate.Auth0UserKey = quoteWrap(user.Auth0UserKey);
	}
	return dbUpdate;
};

const SQL = {};

SQL.read = ({ input = {}, ctx }) => {
	const { user = {} } = input;
	const { id } = user;
	const query = `
		-- read user: ${id}
		SELECT 
			r.*,
			c.PhoneNumber,
			c.MailingAddress1,
			c.MailingAddress2,
			c.MailingCity,
			c.MailingState,
			c.MailingZipCode
		FROM (vAllUserRoles r
			LEFT OUTER JOIN Customers c
			ON (c.id = r.CustomerIDIfApplicable)
		)
		${whereClause({
			Auth0UserKey: ctx?.user?.sub,
			UserID: id,
		})
			.replace('Auth0UserKey', 'r.Auth0UserKey')
			.replace('UserID', 'r.UserID')}
	;`.trim();

	return { query, map: fromDBUser };
};

SQL.create = (input = {}) => {
	const { user } = input;

	const dbUser = toDBUser(user);
	const dbRoles = toDBRoles({ ...user, id: '@UserId' });
	const isGuestCustomer =
		!user.Auth0UserKey && user.roles.find((x) => x.type === 'CUSTOMER');

	const query = `
		${user.Auth0UserKey ? `-- insert customer: ${user.Auth0UserKey}` : ''}
		${isGuestCustomer ? `-- insert guest customer` : ''}
		${(user?.roles || []).find(isSiteAdmin) ? `-- insert site admin` : ''}
		${(user?.roles || []).find(isLOAdmin) ? `-- insert local office admin` : ''}
		DECLARE @UserId INT;

		${insertQuery('Users', dbUser)}

		SET @UserId = @@identity;

		${dbRoles
			.map((x) =>
				insertQuery('UserRoles', x).replace("'@UserId'", '@UserId')
			)
			.join('\n\n')}

		${
			user.roles.find((x) => x.type === 'CUSTOMER')
				? insertQuery('Customers', {
						CustomerBasicName: quoteWrap(
							`${user.first} ${user.last}`.trim()
						),
						FirstName: quoteWrap(user?.first || ''),
						LastName: quoteWrap(user?.last || ''),
						Email: quoteWrap(user?.email || ''),
						UserID: '@UserId',
						MailingZipCode: quoteWrap(user?.address?.zip || ''),
				  }).replace("'@UserId'", '@UserId')
				: ``
		}

		${SQL.read({ input: { user: { id: '@UserId' } } }).query.replace(
			"'@UserId'",
			'@UserId'
		)}
	`.trim();
	return { query, map: fromDBUser };
};

SQL.update = (user = {}) => {
	const { id } = user;
	const dbUser = toDBUserUpdate(user);

	const query = `
	UPDATE Users
	SET ${Object.entries(dbUser)
		.map(([k, v]) => `${k}=${v}`)
		.join(', ')}
	WHERE id = '${id}';

	${SQL.read({ input: { user: { id } } }).query}
	`;
	return { query, map: fromDBUser };
};

// const fromInvite = () => {};

// const get = async (input, ctx) => {
// 	const user = { ...ctx.user, roles: ctx.roles };
// 	if (!input.inviteCode) return user;

// 	return user;
// };

const read = async ({ input, ctx }) => {
	const { query, map } = SQL.read({ input, ctx });
	const userRoles = await databaseExec(query);
	return map(userRoles);
};

const create = async ({ input = {} }) => {
	const { user } = input;
	const { query, map } = SQL.create({ user });
	const userRoles = await databaseExec(query);
	return map(userRoles);
};

const update = async ({ input, ctx }) => {
	const { user } = input || {};
	const { inviteCode, Auth0UserKey } = user || {};

	let invite = {};
	if (inviteCode) {
		[invite] = await inviteStore.read({ inviteCode });
	}

	const { user: { id } = {} } = invite;

	const { query, map } = SQL.update({ id, Auth0UserKey });
	const userRoles = await databaseExec(query);
	return map(userRoles);
};

module.exports = {
	read,
	create,
	update,
};
