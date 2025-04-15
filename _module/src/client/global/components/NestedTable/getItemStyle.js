import { cssProps } from '../../utils/cssProps';

export const getItemStyle = (item, debug) => {
	if (typeof item !== 'object') return {};
	const style = {
		'cell.width': 'unset',
		'cell.flex': 'unset',
	};
	if (debug) console.log({ getItemStyle: item });
	for (const propName of cssProps()) {
		if (typeof item[propName] !== 'undefined') {
			style[propName] = item[propName];
		}
		if (typeof item['cell.' + propName] !== 'undefined') {
			style['cell.' + propName] = item['cell.' + propName];
		}
	}

	return style;
};
