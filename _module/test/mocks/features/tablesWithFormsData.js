const { faker } = require('@faker-js/faker');

const getItem = (x, i) => ({
	myID: i + 1,
	name: faker.name.fullName(),
});

module.exports = (args, query, session) => {
	try {
		const items = new Array(5).fill().map(getItem);
		return JSON.stringify(items);
	} catch (e) {
		console.error(e);
		return '[]';
	}
};
