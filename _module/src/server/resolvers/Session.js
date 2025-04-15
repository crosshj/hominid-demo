const sessionStore = require('../store/Session');

const query = async (obj, args, ctx, info) => {
	const { input } = args;
	try {
		return await sessionStore.read({ input, ctx });
	} catch (e) {
		console.error(e);
		return new Error('could not read session from database');
	}
};

module.exports = { query };
