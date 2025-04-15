const contextStore = require('../store/ContextProc');

const query = async (obj, args, ctx, info) => {
	const { input } = args;
	try {
		return await contextStore.read({ input, ctx });
	} catch (e) {
		console.error(e);
		return new Error('could not read context from database');
	}
};

module.exports = { query };
