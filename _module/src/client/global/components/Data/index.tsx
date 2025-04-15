import { useCallback, useEffect, useRef } from 'react';
//import { useValidation } from '../Validator';

import { getData } from '../../services/getData';
import { StateManager } from '../../../state/state';

import { getStaticParams, paramsFromPath } from '../../utils/params';
import parseValue from '../../utils/parseValue';
import { ReactComment } from '../../utils/ReactComment';
import { handleDateKeywords } from '../../utils/dateKeywords';

import { useParams } from './useParams';
import { enhanceArgs } from './enhanceArgs';
import { useSource } from './useSource';

const argsCache = {};
const getDataFromDB = (...args: any) => {
	const [_0, , , name] = args;
	const isRefresh = typeof _0.message === 'string';
	if (isRefresh) {
		const name = _0.message.replace('refresh:', '');
		const cachedArgs = (argsCache as any)[name];
		const hasCache = Array.isArray(cachedArgs);
		return hasCache ? getData(...cachedArgs) : undefined;
	}
	// keep track of most recent args, make available to call later
	(argsCache as any)[name] = args;
	return getData(...args);
};

export const Data = (argsSrc: any) => {
	const mountedRef = useRef(false);
	const args = enhanceArgs(argsSrc);
	const {
		proc,
		procArg,
		params = [],
		name,
		paramName,
		defaultValue,
		defaultValueType,
		debug,
		garbageCollect = false,
		//validate,
	} = args;
	const [, thisSetter]: any = StateManager.useListener(name, undefined, {
		debug,
		note: `components/Data - ${name}`,
	});
	const [menu]: any = StateManager.useListener('menu', undefined, {
		note: `components/Data - menu - ${name}`,
	});
	const [globalState, _setState]: any = StateManager.useListener(
		undefined,
		undefined,
		{
			note: `components/Data - globalState - ${name}`,
		},
	);

	const { param = '' } = menu || {};

	// const { depends, dependsDefault } = getDepends(args);
	// const dependsGlobalValue = depends && globalState[depends];

	//const validator = globalState?.schemas?.[validate];
	//const myValidator = useValidation(validate);

	// const initialPathParams = useMemo(
	// 	() => paramsFromPath(args.route),
	// 	[args.route, menu]
	// );
	// const [pathParams, setPathParams] = useState(initialPathParams);

	// const setGlobalState = useCallback(
	// 	(x) => {
	// 		const value = x[name];
	// 		StateManager.update(name, value);
	// 		//setState(...x);
	// 	},
	// 	[name]
	// );

	useEffect(() => {
		const subCfg = {};
		if (debug) (subCfg as any).debug = true;
		const unsubscribe = StateManager.subscribe(
			'refresh:' + name,
			getDataFromDB,
			subCfg,
		);
		return () => {
			unsubscribe && unsubscribe();
			garbageCollect && StateManager.update(name, undefined);
		};
	}, [debug, name]);

	//Added initialPathParams and globalState to the things useEffect listens to here.
	//Fixed problem with path data passed by button not triggering Data component to update.
	//Monitor in case this causes other problems.
	useEffect(() => {
		if (!args.route) return;
		const pathParams = paramsFromPath(args);
		//if (!params) return;
		// const useDefault =
		// 	typeof pathParams !== 'object' ||
		// 	(typeof args.defaultValue !== 'undefined' &&
		// 		Object.keys(pathParams).find(
		// 			(key) => typeof pathParams[key] === 'undefined',
		// 		));
		// if (useDefault) {
		// 	thisSetter(args.defaultValue);
		// 	return;
		// }
		if (debug) {
			console.log({ _: 'pathParams: change', args, menu, pathParams });
		}
		thisSetter(pathParams);
	}, [args.route, menu, thisSetter]);

	//this data depends on another global data
	useSource(args, [name]);
	// useEffect(() => {
	// 	if (!name) return;
	// 	if (!dependsDefault) return;
	// 	if (!Array.isArray(dependsGlobalValue)) return;
	// 	if (!setState) return;
	// 	if (typeof globalState[name] !== 'undefined') return;

	// 	const autoDefault = (
	// 		(dependsDefault === 'last'
	// 			? dependsGlobalValue[dependsGlobalValue.length - 1]
	// 			: dependsGlobalValue[0]) || {}
	// 	).value;
	// 	if (typeof autoDefault === 'undefined') return;
	// 	//console.log(`Data component: set ${name} default (${autoDefault})`);
	// 	StateManager.update(name, autoDefault);
	// }, [dependsGlobalValue, dependsDefault, globalState, name, setState]);

	//this data has a default value, but does not depend on another data
	useEffect(() => {
		if (!name) return;
		if (['first', 'last'].includes(defaultValue)) return;
		if (typeof defaultValue === 'undefined') return;
		if (defaultValue === 'no_default') return;
		// if (!setState) return;
		if (typeof globalState?.[name] !== 'undefined') return;

		//console.log(`Data component: set ${name} default (${defaultValue})`);
		let valueParsed = parseValue(defaultValue);
		if (defaultValueType === 'string') {
			valueParsed = JSON.stringify(valueParsed, null, 4);
		}
		if (valueParsed === 'static_null' || valueParsed === 'null') {
			valueParsed = null;
		}

		valueParsed = handleDateKeywords(valueParsed);

		const parsedOrDefault =
			typeof valueParsed !== 'undefined' ? valueParsed : defaultValue;

		StateManager.update(name, parsedOrDefault);
	}, [defaultValue, defaultValueType, globalState, name]);

	//this data comes from DB and depends on other data (params)
	useParams(args, undefined, (...getDataArgs: any[]) => {
		debug && console.log({ _: 'Data:useParams', getDataArgs });
		return getDataFromDB(...getDataArgs);
	});

	//this data comes from DB and does not depend on params (or uses only static params)
	useEffect(() => {
		if (!name) return;
		if (!proc) return;
		// this will be handled by useParams
		if ((params || []).length) return;

		const queryArgs = {};
		if (paramName && param) {
			(queryArgs as any)[paramName] = param;
		}

		// console.log(`Data component: get ${name} from ${proc} - ${procArg}`);
		const staticParams = Object.entries(getStaticParams(args)).reduce(
			(acc: any, [key, val]) => {
				if (val === 'static_null' || val === 'null') val = null;
				acc[key] = handleDateKeywords(val);
				return acc;
			},
			{},
		);

		const paramsToSubmit = {
			...(procArg ? { key: procArg } : {}),
			...staticParams,
			...queryArgs,
		};

		const getDataArgs = [
			proc || 'ui.sp_GetResourceListViews',
			paramsToSubmit,
			undefined, //setGlobalState,
			name,
		];
		debug && console.log({ _: 'Data:useEffect', getDataArgs });
		getDataFromDB(...getDataArgs);
	}, [name, mountedRef, debug]);

	if (debug) {
		return <ReactComment ref={mountedRef} text={'DATA: ' + name} />;
	}

	return <></>;
};
