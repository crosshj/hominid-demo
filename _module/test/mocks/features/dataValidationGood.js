module.exports = (args, query, session) => {
	const { key, ...rest } = args;
	return JSON.stringify({
		name: 'Short Name',
		age: 33,
		email: 'shorty@short.com',
		//website: 'www.shortydev.com',
		// ^^^ should also be a valid url without scheme
		website: 'https://www.shortydev.com',
		createdOn: '12/21/2021',
	});
};
