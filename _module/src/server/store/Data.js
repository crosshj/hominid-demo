const StoreHandler = require('./.storeHandler');
const { isDefined } = require('../helpers/utils');

// const _timecardFileProposedChanges = require('./kludge/mocks_json/_timecardFileProposedChanges');
// const _timecardFileUnmatchedChanges = require('./kludge/mocks_json/_timecardFileUnmatchedChanges');

const { OptionsTransform } = require('./mappers/ContextOptions');

const Transform = (results, queryArgs) => {
	return (
		results?.map((result) => {
			return { ...result, id: Object.values(result)[0] };
		}) || []
	);
};

const FormDataTransform = (results, queryArgs) => {
	let [FormDef, FormElements = [], FormData = []] = results;

	const isSkills = FormDef?.[0]?.FormKey === 'prospectSkillsNeeded';
	if (isSkills) {
		return FormData.map(({ SkillID: value }) => ({ value }));
	}

	return FormData?.[0];
};

// accepts params + session and maps them into DATABASE-like arguments
const toDatabaseArgs = ({ params, session }, withSession = false) => {
	const args = [];
	for (const [k, v] of Object.entries(params)) {
		if (isNil(v)) {
			args.push(`@${k}=NULL`);
			continue;
		}
		args.push(`@${k}='${v}'`);
	}
	const argsString = args.join(', ');
	if (withSession) {
		const { branchId, id: userId } = session;
		const sessionParams = `@branchID='${branchId}', @userID='${userId}'`;
		return argsString ? `${sessionParams}, ${argsString}` : sessionParams;
	}
	return argsString;
};

const queryParse = {
	'ui.sp_GetData': (args, results, context, session) => {
		const { branchId, id: userId } = session;
		const { key, resultFormat, ...params } = args;
		const entries = Object.entries(params);

		const argsString = entries
			.map(([k, v]) => {
				if (v === null || ((v || '') + '').toLowerCase() === 'null')
					return `@${k}=NULL`;
				return `@${k}='${v}'`;
			})
			.join(', ');

		//@Anna: please modify option list proc to accept/ignore branchID & userID
		// it's safe to delete this after this is done
		if (key === 'ui.sp_GetOptionLists') {
			return `EXEC ${key} ${argsString}`;
		}

		//Commenting out for now until real stored procs are created...
		if (!argsString) {
			return `EXEC ${key} @branchID='${branchId}', @userID='${userId}'`;
		}
		return `EXEC ${key} @branchID='${branchId}', @userID='${userId}', ${argsString}`;
	},

	'dbo.sp_BranchClientSkillsGetByBranchClientID': (
		args,
		results,
		context,
		session,
	) => {
		const { BranchClientID } = args;
		const argsString = `'${BranchClientID}'`;

		return `EXEC dbo.sp_BranchClientSkillsGetByBranchClientID ${argsString}`;
	},
	'ui.sp_formElementsGetbyFormKey': (args, results, context, session) => {
		const { key, itemId } = args;
		const lang = args.lang || 1;
		const argsString = isDefined(itemId)
			? `'${key}', ${lang}, ${itemId}`
			: `'${key}', ${lang}`;
		return `EXEC ui.sp_formelementsGetbyFormKey ${argsString}`;
	},
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
	'ui.sp_GetOptionLists': (args, results, context, session) => {
		const { key, ...rest } = args;
		const branchId = args?.BranchID || session?.branchId;
		if (branchId === undefined) return;

		// NOTE: take care!  this might be called when it shouldn't be
		if (key.includes('ui.sp_') || Object.keys(rest).length > 0) {
			const vars = [];
			for (const [i, v] of Object.values(rest).entries()) {
				vars[i] = v || '';
			}
			const entries = Object.entries({
				branchId,
				...rest,
			});

			const argsString = entries
				//.map(([k, v]) => `@${k}='${v}'`)
				.map(([k, v]) => {
					if (v === null || ((v || '') + '').toLowerCase() === 'null')
						return `@${k}=NULL`;
					return `@${k}='${v}'`;
				})
				.join(', ');
			return `EXEC ${key} ${argsString}`;
		}

		return `EXEC ui.sp_GetOptionLists '${key}', ${branchId}`;
	},
	'ui.sp_UIContextGetComponentsByUserID': (
		args,
		results,
		context,
		session,
	) => {
		const { params } = args;
		const { fragment, ...rest } = params;
		const argsString = toDatabaseArgs(
			{
				params: { key: fragment, traverseDown: true, lang: 1, ...rest },
				session,
			},
			true,
		);
		return `EXEC ui.sp_UIContextGetComponentsByUserID ${argsString}`;
	},
};

const SkillsTransform = (results) => {
	return results.map(({ SkillID }) => {
		return { id: SkillID };
	});
};

const transformMap = {
	none: (x) => x,
	options: OptionsTransform,
	table: Transform,
	form: FormDataTransform,
};

const resultsParse = {
	'ui.sp_GetData': (args, queryArgs) => {
		const { uuid, name } = args;
		let { resultFormat = 'none' } = queryArgs;
		if (queryArgs.key === 'ui.sp_GetOptionLists') resultFormat = 'options';
		const transformer = transformMap[resultFormat];

		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(transformer(results, queryArgs)),
		});
	},
	'dbo.sp_BranchClientSkillsGetByBranchClientID': (args, queryArgs) => {
		const { uuid, name } = args;

		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(SkillsTransform(results)),
		});
	},
	'ui.sp_GetResourceListViews': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(Transform(results, queryArgs)),
		});
	},
	'ui.sp_formElementsGetbyFormKey': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(FormDataTransform(results, queryArgs)),
		});
	},
	'ui.sp_GetOptionLists': (args, queryArgs) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(OptionsTransform(results, queryArgs)),
		});
	},
	'ui.sp_UIContextGetComponentsByUserID': (
		args,
		results,
		context,
		session,
	) => {
		const { uuid, name } = args;

		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(results),
		});
	},
};

module.exports = {
	read: StoreHandler(queryParse, resultsParse),
	transformMap,
};
