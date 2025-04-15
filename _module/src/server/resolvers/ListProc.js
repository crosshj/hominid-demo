const listStore = require('../store/ListProc');

const query = async (obj, args, ctx, info) => {
	const { input } = args;
	try {
		return await listStore.read({ input, ctx });
	} catch (e) {
		console.error(e);
		return new Error('could not read list from database');
	}
};

module.exports = { query };
