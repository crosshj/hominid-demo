const StoreHandler = require('./.storeHandler');

const { ContextTransform } = require('./mappers/ContextUI');
const { FormTransform } = require('./mappers/ContextForms');
const { OptionsTransform } = require('./mappers/ContextOptions');
const { isDefined } = require('../helpers/utils');

//const branchClientContactsKludge = require('./kludge/_branchClientContactsKludge');
//const { results } = require('./kludge/_branchClientContactsKludge');

const ChartTransform = (results, queryArgs) => {
	return (results || []).map((x) => ({
		label: x.LabelName,
		order: x.BarOrder,
		value: x.Number,
		properties: `color: ${x.Color}`,
	}));
};

// SP calling convention:
// SP_NAME key, branchid, userid, and “additional id” whatever that might be in the case..

const queryParse = {
	'ui.sp_UIContextGetComponentsByUserID': (
		args,
		results,
		context,
		session
	) => {
		let { key, user, branch } = args;
		if (['root.clients', 'root.dashboard']) key = key?.replace('root.', '');
		const userId = user?.id || session?.id;
		const branchId = branch?.id || session?.branchId;
		const tDown = args.traverseDown || 1;
		const lang = args.lang || 1;
		if (userId === undefined) return;
		if (branchId === undefined) return;
		const argsString = `'${key}', '${userId}', ${tDown}, ${lang}, ${branchId}`;
		return `EXEC ui.sp_UIContextGetComponentsByUserID ${argsString}`;
	},
	'ui.sp_formElementsGetbyFormKey': (args, results, context, session) => {
		// if (branchClientContactsKludge.read(args, session))
		// 	return branchClientContactsKludge.read(args, session);
		const { key, itemId } = args;
		const lang = args.lang || 1;
		const argsString = isDefined(itemId)
			? `'${key}', ${lang}, ${itemId}`
			: `'${key}', ${lang}`;
		return `EXEC ui.sp_formelementsGetbyFormKey ${argsString}`;
	},
	'ui.sp_GetOptionLists': (args, results, context, session) => {
		const { key } = args;
		const branchId = args?.BranchID || session?.branchId;
		if (branchId === undefined) return;
		// const entries = Object.entries(rest);
		// const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
		return `EXEC ui.sp_GetOptionLists '${key}', ${branchId}`;
	},
	'ui.sp_GetStackedBarCharts': (args, results, context, session) => {
		const { key } = args;
		return `EXEC ui.sp_GetStackedBarCharts '${key}', ${session.branchId}`;
	},
};

const resultsParse = {
	'ui.sp_UIContextGetComponentsByUserID': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: ContextTransform(results, queryArgs),
		});
	},
	'ui.sp_formElementsGetbyFormKey': (args, queryArgs) => {
		// if (branchClientContactsKludge.results(args, queryArgs))
		// 	return branchClientContactsKludge.results(args, queryArgs);
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormTransform(results, queryArgs),
		});
	},
	'ui.sp_GetOptionLists': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: OptionsTransform(results, queryArgs),
		});
	},
	'ui.sp_GetStackedBarCharts': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: ChartTransform(results, queryArgs),
		});
	},
};

module.exports = {
	read: StoreHandler(queryParse, resultsParse),
};
