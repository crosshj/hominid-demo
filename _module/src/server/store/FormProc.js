const StoreHandler = require('./.storeHandler');
const { transformMap } = require('./Data');
const { FormSubmitTransform } = require('./mappers/FormSubmit');
//const requestActivationArgsKludge = require('./kludge/requestActivationArgs');

const getResultsProps = (results) => {
	const props = {};
	for (const r of results) {
		try {
			const parsed = JSON.parse(r.results);
			Object.entries(parsed[0]).forEach(([k, v]) => (props[k] = v));
		} catch (e) {}
	}
	return props;
};

const queryParse = {
	'ui.sp_Upsert': (args, results, context, session) => {
		const { branchId } = session;
		const userID = session.id;
		const { key, resultFormat, ...params } = args;
		const entries = Object.entries(params);
		const argsString = entries.map(([k, v]) => {
			if (((v || '') + '').toLowerCase() === 'null') return `@${k}=NULL`;

			// @Anna - if you need semicolon separator, use this
			//if(Array.isArray(v)) return `@${k}='${v.join(';')}'`

			const safeValue =
				typeof v?.replace !== 'undefined' ? v.replace("'", "''") : v;

			return `@${k}='${safeValue}'`;
		});
		return `EXEC ${key} @branchID='${branchId}', @userID='${userID}', ${argsString}`;
		//return `SELECT JSON_OBJECT('arr':JSON_ARRAY())`;
	},
	'dbo.sp_InvoiceUpdate': (args, results, context, session) => {
		const entries = Object.entries({ ...args, userId: session.id });
		const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
		return `EXEC dbo.sp_InvoiceUpdate ${argsString}`;
	},
	/* 	'dbo.sp_BranchClientsCreateNew': (args, results, context, session) => {
		const entries = Object.entries({
			...args,
			userId: session.id,
			BranchID: session.branchId,
		});
		const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
		return `EXEC dbo.sp_BranchClientsCreateNew ${argsString}`;
	}, */
	'dbo.sp_BranchClientsUpdate': (args, results, context, session) => {
		const {
			userID,
			ClientIdent,
			PrimaryPhone,
			SalesPersonID,
			BranchID,
			...rest
		} = args;
		const entries = Object.entries({
			userID,
			BranchClientID: ClientIdent,
			BillPhone: PrimaryPhone,
			//BranchID
			//SalesPersonID
			...rest,
		});
		context.BranchClientID = ClientIdent;
		context.userID = userID || session.id;
		const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
		return `EXEC dbo.sp_BranchClientsUpdate ${argsString}`;
	},
	'dbo.sp_BranchClientSkillsUpsert': (args, results, context) => {
		const { SkillID } = args;
		const resultsProps = getResultsProps(results);
		const BranchClientID =
			context?.BranchClientID || resultsProps?.BranchClientID;
		const entries = Object.entries({ BranchClientID, SkillID });
		const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
		return `dbo.sp_BranchClientSkillsUpsert ${argsString}`;
	},
	'dbo.sp_BranchClientContactsCreateNew': (
		args,
		results,
		context,
		session,
	) => {
		const resultsProps = getResultsProps(results);
		const BranchClientID =
			context?.BranchClientID || resultsProps?.BranchClientID;
		const userId = args.userID || context.userID || session.id;
		const entries = Object.entries({ userId, BranchClientID, ...args });
		const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
		return `EXEC dbo.sp_BranchClientContactsCreateNew ${argsString}`;
	},
	// 'dbo.sp_BranchClientRequestActivation': (
	// 	args,
	// 	results,
	// 	context,
	// 	session
	// ) => {
	// 	const BranchClientID = context.BranchClientID || args.BranchClientID;
	// 	const userId = args.userID || context.userID || session.id;
	// 	const entries = Object.entries({
	// 		userId,
	// 		BranchClientID,
	// 		...requestActivationArgsKludge(args),
	// 	});
	// 	const argsString = entries.map(([k, v]) => `@${k}='${v}'`).join(', ');
	// 	return `EXEC dbo.sp_BranchClientRequestActivation ${argsString}`;
	// },
	activateClientSubmit: (args, results, context, session) => {
		const { id } = args;
		return `SELECT JSON_OBJECT('arr':JSON_ARRAY())`;
	},
	/* 	positivePayDownload: (args) => {
		const { downloadPositivePay, printPositivePay } = args;
		//TODO: connect with DB
		return `SELECT JSON_OBJECT('arr':JSON_ARRAY())`;
	}, */
	/* 	processACHDownload: (args) => {
		const {
			downloadACH,
			downloadDirectDeposit,
			downloadPositivePay,
			printACH,
			printDirectDeposit,
			printPositivePay,
		} = args;
		//TODO: connect with DB
		return `SELECT JSON_OBJECT('arr':JSON_ARRAY())`;
	}, */

	/* 	'dbo.sp_PayrollCreatePayChecks': (args, results, context, session) => {
		const { payPeriodID } = args;
		const { branchId } = session;

		return `EXEC dbo.sp_PayrollCreatePayChecks '${branchId}', '${payPeriodID}'`;
	}, */
};

const resultsParse = {
	'ui.sp_Upsert': (args, queryArgs) => {
		const { uuid, name } = args;
		const { resultFormat = 'none' } = queryArgs;
		const transformer = transformMap[resultFormat];
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: JSON.stringify(transformer(results, queryArgs)),
		});
	},
	'dbo.sp_InvoiceUpdate': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormSubmitTransform(results),
		});
	},
	'dbo.sp_BranchClientsCreateNew': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormSubmitTransform(results),
		});
	},
	'dbo.sp_BranchClientsUpdate': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormSubmitTransform(results),
		});
	},
	'dbo.sp_BranchClientSkillsUpsert': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormSubmitTransform(results),
		});
	},
	'dbo.sp_BranchClientContactsCreateNew': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormSubmitTransform(results),
		});
	},
	'dbo.sp_BranchClientRequestActivation': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: FormSubmitTransform(results),
		});
	},
	activateClientSubmit: (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'success',
		});
	},
	/* 	positivePayDownload: (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'success',
		});
	},
	processACHDownload: (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'error',
		});
	}, */
	/* 	'dbo.sp_PayrollCreatePayChecks': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'success',
		});
	}, */
	'dbo.sp_TimecardsUpdateStatus': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'success',
		});
	},
	/* 	'paybillChildHome.paybillChildSubmitPayroll': (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'success',
		});
	}, */
	/* 	paybillChildSubmitPayroll: (args) => {
		const { uuid, name } = args;
		return (results) => ({
			uuid,
			name,
			cacheExpires: '',
			results: 'success',
		});
	}, */
};

module.exports = {
	write: StoreHandler(queryParse, resultsParse),
};
