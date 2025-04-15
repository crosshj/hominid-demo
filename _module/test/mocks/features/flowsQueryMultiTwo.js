module.exports = (args, query, session) => {
	const { key, ...rest } = args;
	return JSON.stringify({
		message: `hello from two!`,
	});
};
