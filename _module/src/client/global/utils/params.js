import _ from 'lodash';
import { ApplyStringFormatters } from './parseProperties';

export const paramsFromPath = (args = {}) => {
	const { route, defaultValue = {}, debug } = args;
	if (!route) {
		if (debug) {
			console.log({ _: 'paramsFromPath: no route in args', args });
		}
		return { ...defaultValue };
	}

	const [pathname, hash] = route.split('#');
	try {
		const pattern = new window.URLPattern({ pathname, hash });
		const patternExec = pattern.exec(document.location);
		const output = {
			...defaultValue,
			...(patternExec?.pathname.groups || {}),
			...(patternExec?.hash.groups || {}),
		};
		if (debug) {
			console.log({ _: 'paramsFromPath', patternExec, output, args });
		}
		return output;
	} catch (e) {
		console.warn(e);
		return { ...defaultValue };
	}
};

export const getDepends = (args) => {
	const { source, defaultValue } = args;
	const paramsDefined =
		[source, defaultValue].filter((x) => !!x).length === 2;
	if (!paramsDefined) return {};
	const depends = { depends: source, dependsDefault: defaultValue };
	return depends;
};

export const getParams = (args, removeGlobal = true) => {
	const prefixed = Object.keys(args)
		.filter((x) => x.startsWith('param_'))
		.filter((x) => {
			if (!args[x].startsWith) return false;
			if (args[x].startsWith('static_')) return false;
			return true;
		})
		.map((x) => {
			if (!args[x].replace) return args[x];
			return removeGlobal
				? args[x]
						.replace(/^global_/, '')
						.split('.')
						.shift()
				: args[x];
		})
		.filter((x) => x);
	const splitParams = (args.params || '').split('&');
	const allParams = splitParams.concat(prefixed).filter((x) => x);
	return Array.from(new Set(allParams));
};

export const getStaticParams = (args) => {
	const paramsPrefixed = Object.keys(args)
		.filter((x) => args[x].startsWith && args[x].startsWith('static_'))
		.reduce(
			(a, o) => ({
				...a,
				[o.replace('param_', '')]: args[o].replace('static_', ''),
			}),
			{},
		);
	return paramsPrefixed;
};

export const cleanSubmittedProps = (args, paramsToSubmit) => {
	const submit = JSON.parse(JSON.stringify(paramsToSubmit));
	const allParams = getParams(
		{ ...args, params: '' },
		false /*removeGlobal*/,
	);
	for (const param of allParams) {
		if (!param.includes('.')) continue;
		const path = param.replace('global_', '');
		const [rootObj, ...rest] = path.split('.');
		const property = rest.pop();
		const value = _.get(paramsToSubmit, path);
		submit[property] = value;
		if (property !== rootObj) {
			delete submit[rootObj];
		}
	}
	const prefixed = Object.keys(args).filter((x) => x.startsWith('param_'));
	for (const x of prefixed) {
		const globalKey = args[x].replace(/^global_/, '');
		if (typeof submit[globalKey] === 'undefined') continue;
		const newKey = x.replace('param_', '');
		submit[newKey] = submit[globalKey];
		if (newKey !== globalKey) {
			delete submit[globalKey];
		}
	}
	return submit;
};

export const hydrateParams = ({ params, global = {} }) => {
	const paramsNames = (params?.length > 0 && params.split('&')) || [];
	let paramWithoutValue = false;
	let paramsValues = {};

	for (const pn of paramsNames) {
		const [actualParamName, ...formatterName] = pn.split(':');

		const value = _.get(global, actualParamName.trim());
		if (typeof value === 'undefined') {
			paramWithoutValue = true;
		}

		paramsValues[actualParamName.trim()] = ApplyStringFormatters(
			value,
			formatterName.join(':'),
		);
	}
	return { paramWithoutValue, paramsValues, paramsNames };
};
