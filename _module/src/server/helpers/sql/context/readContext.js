import { getPropertiesForContext } from './getPropertiesForContext.js';

export const readContext = async ({ content, objName }) => {
	const obj = content[objName];

	const output = obj?.reduce((acc, value) => {
		const { key, label, type, order, properties } = value;

		acc += `\nEXEC ui.sp_UIComponentCreateNew '${key}', '${
			label || ''
		}', '', '${type}', '${order || 'MISSING_ORDER'}'\n`;

		if (properties) {
			acc += getPropertiesForContext(value);
		}
		return acc;
	}, '');

	return output;
};
