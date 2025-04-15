import { Input } from './Input';
import { Select } from './Select';

export const TextField = ({ propsIntact, propsFilled, ...rest }) => {
	const SubElement = propsIntact.select ? Select : Input;
	return SubElement({ propsIntact, propsFilled, ...rest });
};
