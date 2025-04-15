// TODO: should also be able to access theme, ie. from src/theme

import * as MUIColor from '@mui/material/colors';

const w3cStandard = [
	'aqua',
	'black',
	'blue',
	'fuchsia',
	'gray',
	'green',
	'lime',
	'maroon',
	'navy',
	'olive',
	'purple',
	'red',
	'silver',
	'teal',
	'white',
	'yellow',
];

export const getColor = (value) => {
	if (value?.includes && value.includes('var(')) return value;
	if (w3cStandard.includes(value)) return value;

	const defaultColor = MUIColor.grey[500];
	const color = value || defaultColor;

	const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	if (hexRegex.test(color)) {
		return color;
	}

	const [hue] = color.split(/(?=[0-9])/);
	const shade = parseInt(color.replace(hue, ''));
	const colorValue = MUIColor[hue]?.[shade || 500];

	return colorValue || defaultColor;
};
