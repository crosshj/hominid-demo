const tablesAddons = require('./tablesAddons');

module.exports = () => {
	try {
		const items = JSON.parse(tablesAddons());

		const modifier = 0.215;
		const totals = {
			sub: {
				hours: items.reduce((a, o) => a + o.hours, 0),
				dollars: items.reduce((a, o) => a + o.dollars, 0),
			},
			modifier,
		};
		totals.grand = {
			hours: totals.sub.hours * totals.modifier,
			dollars: totals.sub.dollars * totals.modifier,
		};
		console.log(totals);
		return JSON.stringify(totals);
	} catch (e) {
		console.error(e);
		return '[]';
	}
};
