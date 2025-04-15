import { FormInput } from '../components';
import { getLastIdElement } from '../utils';

export const formSelectAdapter = ({
	children,
	default: defaultValue,
	value,
	id,
	props,
	...rest
}) => {
	return {
		Component: FormInput,
		select: true,
		name: getLastIdElement(id),
		defaultValue: defaultValue || value,
		children,
		...props,
		...rest,
	};
};
