const { faker } = require('@faker-js/faker');

const getItem = (x, i) => ({
	myID: i + 1,
	datetime: '2019-05-24T19:30',
	someText: faker.color.human(),
	myButtons: faker.name.firstName(),
	myActions: faker.name.firstName(),
	myRadioButtons: faker.name.firstName(),
	myCheckboxes: faker.name.firstName(),
	myLinks: faker.name.firstName(),
	myOptionLists: faker.name.firstName(),
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	description: faker.lorem.lines(),
	isYesNo: faker.helpers.arrayElement(['1', '2']),
});

module.exports = (args, query, session) => {
	try {
		const qty = typeof args.qty === 'undefined' ? 50 : Number(args.qty);
		const items = new Array(qty).fill().map(getItem);
		return JSON.stringify(items);
	} catch (e) {
		console.error(e);
		return '[]';
	}
};
