import { Checkbox } from '../components/Checkbox';
import { getLastIdElement } from '../utils/getLastIdElement';

export const checkboxAdapter = ({ label, gridVariant, id, props, ...rest }) => {
	return {
		Component: Checkbox,
		label,
		gridVariant,
		name: getLastIdElement(id),
		...props,
		...rest,
	};
};
