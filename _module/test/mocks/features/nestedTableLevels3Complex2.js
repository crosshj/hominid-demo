const mock = [
	{
		firstLevelName: 2,
		secondLevelName: '2-2',
		thirdLevelName: '2-2-3',
		nestedChildName: '2-2-3-A',
		color: 'blue',
		shape: undefined,
		texture: undefined,
	},
	{
		firstLevelName: 2,
		secondLevelName: '2-2',
		thirdLevelName: '2-2-3',
		nestedChildName: '2-2-3-B',
		color: 'red',
		shape: 'square',
		texture: undefined,
	},
	{
		firstLevelName: 2,
		secondLevelName: '2-2',
		thirdLevelName: '2-2-3',
		nestedChildName: '2-2-3-C',
		color: 'green',
		shape: 'octagon',
		texture: 'plush',
	},
].map((x, i) => ({ ...x, myIndex: i + '' }));

module.exports = (args, query, session) => {
	//if (args?.itemId) return;
	return JSON.stringify(mock);
};
