import _ from 'lodash';

import {
	cleanSubmittedProps,
	getStaticParams,
	hydrateParams,
} from '../../utils/params';
import { useEffect } from 'react';
import { StateManager } from '../../../state/state';
import { globalParams } from './globalParams';
import { handleDateKeywords } from '../../utils/dateKeywords';

const handler =
	({ pn, args, getDataFromDB }) =>
	() => {
		const { proc, procArg, param, paramName, name } = args;
		const { paramNames, paramNamesWithFormatters } =
			globalParams(args) || {};
		const _source = proc || 'ui.sp_GetResourceListViews';
		const global = StateManager.get();
		const value = _.get(global, pn);
		const { paramWithoutValue, paramsValues: hydratedParams } =
			hydrateParams({
				params: paramNamesWithFormatters.join('&'),
				global,
			});
		if (paramWithoutValue) {
			args?.debug &&
				console.log(
					`[${name}]: missing param value, will set to undefined`,
				);
			args?.debug && console.log(`[${name}]`, { params: hydratedParams });
			StateManager.update(name, undefined);
			return;
		}

		const queryArgs = {};
		if (paramName && param) {
			queryArgs[paramName] = param;
		}
		const staticParams = Object.entries(getStaticParams(args)).reduce(
			(acc, [key, val]) => {
				acc[key] = handleDateKeywords(val);
				return acc;
			},
			{},
		);
		const paramsToSubmit = cleanSubmittedProps(args, {
			...(procArg ? { key: procArg } : {}),
			...staticParams,
			...queryArgs,
			...hydratedParams,
		});
		const mappedParams = {};
		if (typeof args?.paramsMap === 'object') {
			for (const [paramName, paramValue] of Object.entries(
				paramsToSubmit,
			)) {
				const mappedParamName = args.paramsMap[paramName];
				mappedParams[mappedParamName || paramName] = paramValue;
			}
		}
		//if one of your params changed and you have all your params now, make the call to update
		args?.debug && console.log(`[${name}] ${pn}: updated to ${value}`);
		getDataFromDB(_source, mappedParams, undefined, name);
	};

/*
	when a useParams is called, there may have already been updates to state it depends on
	if so, it may not get updates which trigger a call to DB
	there are at least two approaches to handling this:

	1) any time any update happens, check if the previous value is the same as what is known locally
		- caveat: this assumes some update will happen after the subscribe (what if not?)
	2) when a subscribe happens, call the handler with current value in global state if it exists
		- caveat: what if the job of the handler has already been done elsewhere (needlessly redundant)

	shouldUpdate is in line with #1, but we may use #2 going forward
*/
const shouldUpdate = (pn) => {
	let prevValue;
	return ({ next }) => {
		const newValue = _.get(next, pn);
		const isEqual = _.isEqual(
			JSON.stringify(prevValue),
			JSON.stringify(newValue),
		);
		if (isEqual) return false;

		prevValue = newValue;
		return true;
	};
};

export const useParams = (args, argsHandler, getDataFromDB) => {
	useEffect(() => {
		const { paramNames } = globalParams(args) || {};
		// const paramNames =
		// 	(args?.params?.length > 0 && args?.params.split('&')) || [];
		// args?.name === 'clientChildDetails' &&
		// 	console.log({ paramNames, args });
		if (!paramNames?.length) return;
		const unsub = [];
		const subCfg = {};
		if (args.debug) subCfg.debug = true;

		for (const pn of paramNames) {
			const thisHandler =
				typeof argsHandler === 'function'
					? argsHandler
					: handler({ pn, args, getDataFromDB });
			const unsubscribe = StateManager.subscribe(
				shouldUpdate(pn),
				thisHandler,
				{ note: `useParams[${pn}]:${args.name}`, ...subCfg },
			);

			unsub.push(unsubscribe);
		}

		return () => {
			for (const unsubscribe of unsub) {
				unsubscribe();
			}
		};
	}, [args?.name]);
};
