const formStore = require('../store/FormProc');

const mutation = async (obj, args, ctx, info) => {
	const { input } = args;
	try {
		return await formStore.write({ input, ctx });
	} catch (e) {
		console.error(e);
		return new Error('could not submit form to database');
	}
};

module.exports = { mutation };
