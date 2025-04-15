const { faker } = require('@faker-js/faker');

const mock = [
	{
		shiftsSupervisor: faker.name.fullName(),
		shiftsStartTime: '6:00 am',
		shiftsExpectedHours: '10',
	},
	{
		shiftsSupervisor: faker.name.fullName(),
		shiftsStartTime: '10:00 pm',
		shiftsExpectedHours: '10',
	},
	{
		shiftsSupervisor: faker.name.fullName(),
		shiftsStartTime: '8:00 am',
		shiftsExpectedHours: '9',
	},
	{
		shiftsSupervisor: faker.name.fullName(),
		shiftsStartTime: '3:00 pm',
		shiftsExpectedHours: '9',
	},
];

module.exports = (args, query, session) => {
	//if (args?.itemId) return;
	return JSON.stringify(mock);
};
