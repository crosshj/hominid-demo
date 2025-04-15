const { faker } = require('@faker-js/faker');

const getItem = ({ id }) => ({
	assignedBranch: faker.helpers.arrayElement(['1', '2']),
	assignedSalesperson: faker.name.fullName(),
});

module.exports = (args, query, session) => {
	try {
		const { id } = args;
		return JSON.stringify(getItem({ id }));
	} catch (e) {
		console.error(e);
		return '{}';
	}
};
