const { faker } = require('@faker-js/faker');

const getItem = () => ({
	language: faker.helpers.arrayElement([
		'English',
		'German',
		'Tagalog',
		'French',
		'Spanish',
		'Portuguese',
	]),
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
});

module.exports = (args, query, session) => {
	try {
		return JSON.stringify(getItem());
	} catch (e) {
		console.error(e);
		return '{}';
	}
};
