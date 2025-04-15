const mock = [
	{
		firstLevelName: 1,
		secondLevelName: '1-1',
		thirdLevelName: '1-1-1',
		nestedChildName: '1-1-1-A',
	},
	{
		firstLevelName: 1,
		secondLevelName: '1-1',
		thirdLevelName: '1-1-1',
		nestedChildName: '1-1-1-B',
	},
	{
		firstLevelName: 1,
		secondLevelName: '1-1',
		thirdLevelName: '1-1-2',
		nestedChildName: '1-1-2-A',
	},
	{
		firstLevelName: 1,
		secondLevelName: '1-1',
		thirdLevelName: '1-1-3',
		nestedChildName: '1-1-3-A',
	},
	{
		firstLevelName: 1,
		secondLevelName: '1-1',
		thirdLevelName: '1-1-3',
		nestedChildName: '1-1-3-B',
	},
	{
		firstLevelName: 1,
		secondLevelName: '1-1',
		thirdLevelName: '1-1-3',
		nestedChildName: '1-1-3-C',
	},
	{
		firstLevelName: 1,
		secondLevelName: '1-2',
		thirdLevelName: '1-2-3',
		nestedChildName: '1-2-3-A',
	},
	{
		firstLevelName: 2,
		secondLevelName: '2-2',
		thirdLevelName: '2-2-3',
		nestedChildName: '2-2-3-A',
	},
	{
		firstLevelName: 3,
		secondLevelName: '3-1',
		thirdLevelName: '3-1-1',
		nestedChildName: '3-1-1-A',
	},
	{
		firstLevelName: 3,
		secondLevelName: '3-1',
		thirdLevelName: '3-1-2',
		nestedChildName: '3-1-2-A',
	},
	{
		firstLevelName: 3,
		secondLevelName: '3-1',
		thirdLevelName: '3-1-1',
		nestedChildName: '3-1-1-B',
	},
	{
		firstLevelName: 3,
		secondLevelName: '3-1',
		thirdLevelName: '3-1-3',
		nestedChildName: '3-1-3-A',
	},
	{
		firstLevelName: 3,
		secondLevelName: '3-2',
		thirdLevelName: '3-2-1',
		nestedChildName: '3-2-1-A',
	},
].map((x, i) => ({ ...x, myIndex: i + '' }));

module.exports = (args, query, session) => {
	//if (args?.itemId) return;
	return JSON.stringify(mock);
};
