const { faker } = require('@faker-js/faker');

const getItem = (x, i) => ({
	id: Number(i),
	FirstName: faker.name.firstName(),
	LastName: faker.name.lastName(),
	Address1: faker.address.streetAddress(),
	Address2: faker.address.secondaryAddress(),
	City: faker.address.city(),
	State: faker.address.state(),
	ZipCode: faker.address.zipCode(),
});

module.exports = (args, query, session) => {
	try {
		const items = new Array(3).fill().map(getItem);
		return JSON.stringify(items);
	} catch (e) {
		console.error(e);
		return '[]';
	}
};
