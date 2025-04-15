module.exports = (args, query, session) => {
	const { key, ...rest } = args;
	return JSON.stringify({
		name: 'bad because I am too long for a name and that not go',
		age: -1,
		//age: 'not an age, but -1 should also reject based on positive attr',
		email: 'bad not an email',
		website: 'bad not a website dot com',
		createdOn: 'bad not a date',
	});
};
