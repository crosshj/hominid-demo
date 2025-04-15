const { createToken } = require('../helpers/crypto');
const dayjs = require('dayjs');
const { readDB: databaseExec } = require('../integrations/database');
const { pipe } = require('../helpers/utils');
const {
	quoteWrap,
	SQLDate,
	fromSQLDate,
	whereClause,
	insertQuery,
} = require('../helpers/sql');

const fromDBInvite = (dbInvite) => {
	const { id, Token, UserID, ExpiresDT } = dbInvite;
	return {
		id,
		token: Token,
		user: { id: UserID },
		expires: fromSQLDate(ExpiresDT),
	};
};

const toDBInvite = (invite = {}) => {
	const { token, user, expires } = invite;
	return {
		Token: quoteWrap(token),
		UserID: quoteWrap(user?.id),
		ExpiresDT: SQLDate(expires),
	};
};

const SQL = {};

SQL.read = (input = {}) => {
	const { inviteCode, id } = input;

	const query = `
		-- read user invite: ${inviteCode}
		SELECT
		*
		FROM UserAccountInvites
		${whereClause({
			id,
			Token: inviteCode,
		})}
	`;
	return { query, map: fromDBInvite };
};

SQL.create = (input = {}) => {
	const { user } = input;
	const token = createToken().slice(0, 32);
	const expires = dayjs().add(3, 'day').toISOString();
	const dbInvite = toDBInvite({
		token,
		user,
		expires,
	});
	const query = `
		${insertQuery('UserAccountInvites', dbInvite)}

		${SQL.read({ id: '@@identity' }).query.replace("'@@identity'", '@@identity')}
	`;
	return { query, map: fromDBInvite };
};

module.exports = {
	read: pipe(SQL.read, databaseExec),
	create: pipe(SQL.create, databaseExec),
};
