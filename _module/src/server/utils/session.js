const jwt = require('jwt-simple');
const secret = 'xxx'; //TODO: store secret in env

function isSessionNeeded(name, queryArgs) {
	//console.log(JSON.stringify({ name, queryArgs }, null, 2));
	if (name === 'ui.sp_UIContextGetComponentsByUserID') {
		return false;
	}
	if (name === 'ui.sp_Upsert' && queryArgs?.key === 'dbo.sp_PreUserUpsert') {
		return false;
	}
	return true;
}

function tryDecodeToken(token, secret) {
	try {
		return jwt.decode(token, secret);
	} catch (e) {}
}

module.exports.getSession = ({ name, queryArgs }) => {
	try {
		//console.log({ queryArgs });
		const token = queryArgs?.token;
		delete queryArgs?.token;

		const session = tryDecodeToken(token, secret);
		const needed = isSessionNeeded(name, queryArgs);
		if (needed && !session) {
			return { error: 'unable to parse session token' };
		}
		return session || {};
	} catch (error) {
		return { error };
	}
};
