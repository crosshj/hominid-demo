const items = [
	{
		myID: 1,
		firstName: 'Mariano',
		lastName: 'Kuhlman',
		hours: 40,
		dollars: 1800.35,
	},
	{
		myID: 2,
		firstName: 'Carroll',
		lastName: 'Helmer',
		hours: 20.25,
		dollars: 500.26,
	},
	{
		myID: 3,
		firstName: 'Lance',
		lastName: 'Wehner',
		hours: 2.5,
		dollars: 175,
	},
	{
		myID: 4,
		firstName: 'Tandy',
		lastName: 'Filsner',
		hours: 45.1,
		dollars: 3500.72,
	},
];

module.exports = (args, query, session) => {
	try {
		return JSON.stringify(items);
	} catch (e) {
		console.error(e);
		return '[]';
	}
};
