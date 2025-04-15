// @Anna
const mock = [
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company A',
		yValue2021: '1000000',
		yValue2022: '1005000',
	},
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company B',
		yValue2021: '1500250',
		yValue2022: '1020034',
	},
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company C',
		yValue2021: '975000',
		yValue2022: '1100000',
	},
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company D',
		yValue2021: '980000',
		yValue2022: '970060',
	},
];
module.exports = (args, query, session) => {
	return JSON.stringify(mock);
};
