import { parseProperties } from './parseProperties';

const UI_item = ({ properties = '', type, key, ...item }) => {
	try {
		const parsedProperties = parseProperties(properties);
		const allProps = {
			type,
			props: parsedProperties,
			...item,
			key,
			id: key,
		};
		return allProps;
	} catch (e) {
		console.log('error parsing context element', item, e);
		return item;
	}
};

export const contextParser = (UIContext) => {
	if (!UIContext || UIContext?.length === 0) return;
	return (UIContext || []).map(UI_item);
};
