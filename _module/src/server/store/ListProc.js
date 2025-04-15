const StoreHandler = require('./.storeHandler');
const { ListTransform } = require('./mappers/List');

const queryParse = {
	'ui.sp_GetResourceListViews': (args, results, context, session) => {
		const userId = session.id;
		const branchId = session.branchId;
		const { key, ...rest } = args;
		const vars = ['', '', ''];
		for (const [i, v] of Object.values(rest).entries()) {
			vars[i] = v || '';
		}
		const argsString = `'${key}', '${branchId}', '${userId}', '${vars[0]}'`;
		return `EXEC ui.sp_GetResourceListViews ${argsString}`;
	},
	'ui.': (args) => {
		const { key, ...rest } = args;
		const entries = Object.entries(rest);
		// TODO: args will be different for each key type
		const argsString = entries?.length
			? `'${key}', ` + entries.map(([k, v = '']) => `'${v}'`).join(', ')
			: `'${key}'`;
		return `EXEC ui. ${argsString}`;
	},
};

const resultsParse = {
	'ui.sp_GetResourceListViews': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: ListTransform(results, queryArgs),
		});
	},
	'ui.': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: ListTransform(results),
		});
	},
};

module.exports = {
	read: StoreHandler(queryParse, resultsParse),
};
