import { getPropertiesForForm } from './getPropertiesForForm.js';

export const readForm = async ({ content, objName }) => {
	const {
		ContextProc: [{ results }],
	} = content[Object.keys(content).find((key) => key === objName)];

	let formKey, formTarget;
	const output = results.reduce((acc, value) => {
		const {
			type,
			key,
			label,
			target,
			order,
			default: defaultValue,
			parent,
			properties,
		} = value;

		if (type === 'Form') {
			formKey = key;
			formTarget = target;

			acc += `\nEXEC ui.sp_FormDefCreateNew '${formKey}', '${'SOME_FORM_TITLE_HERE'}', '${formKey}FormLabel', '${'KEY_DB_TABLE'}', '${'KEY_DB_COLUMN'}', '${'TITLE_VALUE_COLUMN'}', '${'SP_NAME'}', '${'PARAMS'}', '${'SP_NAME_CUD'}'`;
			return acc;
		}

		if (type === 'Section') {
			acc += `\n\tEXEC ui.sp_FormSectionCreateNew '${formKey}', '${
				key || 'MISSING_KEY'
			}', '${key || 'MISSING_KEY'}', '${label}', '${
				order || 'MISSING_ORDER'
			}'`;
			return acc;
		}

		acc += `\n\t\tEXEC ui.sp_FormElementCreateNew '${formKey}', '${key}', '${
			label || 'MISSING_LABEL'
		}', '${label || 'MISSING_LABEL'}', '${type || 'MISSING TYPE'}', '${
			defaultValue || ''
		}', '${order || 'MISSING_ORDER'}', '${
			parent || 'MISSING SECTION KEY'
		}'\n`;

		if (properties) {
			acc += getPropertiesForForm(formKey, value);
		}
		return acc;
	}, '');

	return output;
};
