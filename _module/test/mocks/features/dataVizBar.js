// @Anna
const mock = [
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company A',
		yValue: '1000000',
		yAverage: '500000'
	},
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company B',
		yValue: '1500250',
		yAverage: '750125'
	},
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company C',
		yValue: '975000',
		yAverage: '487500'
	},
	{
		xAxis: 'Company Name',
		yAxis: 'Yearly Revenue',
		xValue: 'Company D',
		yValue: '980000',
		yAverage: '490000'
	},
];
module.exports = (args, query, session) => {
	return JSON.stringify(mock);
};
