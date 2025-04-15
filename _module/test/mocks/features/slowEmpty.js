const delay = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = async (args, query, session) => {
	const DEFAULT_DELAY = 1000;
	const delayMs =
		typeof args?.delayMs !== 'undefined'
			? Number(args?.delayMs)
			: DEFAULT_DELAY;
	await delay(delayMs);
	return '[]';
};
