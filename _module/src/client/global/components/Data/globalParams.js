export const globalParams = (args = {}) => {
	const paramNames = [];
	const paramNamesWithFormatters = [];

	const paramsPrefixed = Object.keys(args).filter((x) =>
		x.startsWith('param_'),
	);
	for (const param of paramsPrefixed) {
		const paramVal = String(args[param]);
		if (paramVal === 'undefined') continue;
		if (!paramVal.includes('global_')) continue;
		const _paramName = paramVal.replace('global_', '');

		paramNames.push(_paramName.split(':')[0]);
		paramNamesWithFormatters.push(_paramName);
	}

	return { paramNames, paramNamesWithFormatters };
};
