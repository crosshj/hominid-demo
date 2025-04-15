import _ from 'lodash';

import { clone } from '../../utils';
import { getParams } from '../../utils/params';

export const enhanceArgs = (args) => {
	const cloned = JSON.parse(JSON.stringify(args));

	// params-prefixed params
	const paramsPrefixed = _.keys(cloned).filter((x) => x.startsWith('param_'));
	if (paramsPrefixed.length) {
		const allParams = getParams(cloned);
		cloned.params = allParams.join('&');
		cloned.paramsMap = {};
		paramsPrefixed.forEach((x) => {
			const prefixedParam = x.replace('param_', '');
			const paramVal = String(args[x]);
			if (paramVal === 'undefined') return;
			if (!paramVal.includes('global_')) return;

			const paramTarget = paramVal
				.replace('global_', '')
				.split('.')
				.pop();
			cloned.paramsMap[paramTarget] = prefixedParam;
		});
	}

	// get-prefixed Data params
	const getParamKey = Object.keys(cloned).find((x) => x.startsWith('get'));
	if (!getParamKey) return cloned;

	const getParamValue = cloned[getParamKey];

	cloned.name = cloned.name || getParamValue;
	cloned.proc = 'ui.sp_GetData';
	cloned.procArg = getParamValue;

	if (getParamKey === 'getList') {
		const { procArg, additionalParams } = handleGetList(getParamValue);

		return {
			...cloned,
			procArg,
			...(additionalParams || {}),
		};
	}
	if (getParamKey === 'getOpts') {
		const { procArg, additionalParams } = handleGetOptions(getParamValue);

		return {
			...cloned,
			procArg,
			...(additionalParams || {}),
		};
	}

	return cloned;
};

const handleGetList = (getParamValue) => {
	if (getParamValue.startsWith('ui.sp_RLV')) {
		return { procArg: getParamValue };
	}

	return {
		procArg: 'ui.sp_GetResourceListViews',
		additionalParams: {
			param_ListViewName: 'static_' + getParamValue,
		},
	};
};

const handleGetOptions = (getParamValue) => {
	if (getParamValue.startsWith('ui.sp_OL')) {
		return { procArg: getParamValue };
	}

	return {
		procArg: 'ui.sp_GetOptionLists',
		additionalParams: {
			param_OptionListName: 'static_' + getParamValue,
		},
	};
};
