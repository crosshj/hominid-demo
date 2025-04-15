module.exports = (args, query, session) => {
	const { key, ...rest } = args;
	return JSON.stringify({
		message: `Results submitted with: ${JSON.stringify(rest, null, 2)}`,
	});
};
