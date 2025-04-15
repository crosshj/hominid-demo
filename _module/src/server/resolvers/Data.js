const dataStore = require('../store/Data');

const query = async (obj, args, ctx, info) => {
	const { input } = args;
	try {
		return await dataStore.read({ input, ctx });
	} catch (e) {
		console.error(e);
		return new Error('could not read data from database');
	}
};

module.exports = { query };
