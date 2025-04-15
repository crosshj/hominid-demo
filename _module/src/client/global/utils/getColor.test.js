import * as MUIColor from '@mui/material/colors';
import { getColor } from './getColor';

describe('getColor', () => {
	test('should return the correct color value for valid input', () => {
		const color = 'blue300';
		const result = getColor(color);
		expect(result).toBe(MUIColor.blue[300]);
	});

	test('should return the default color (grey500) for an invalid hue', () => {
		const color = 'invalidHue500';
		const result = getColor(color);
		expect(result).toBe(MUIColor.grey[500]);
	});

	test('should return the default color (grey500) for an invalid shade', () => {
		const color = 'blueInvalidShade';
		const result = getColor(color);
		expect(result).toBe(MUIColor.grey[500]);
	});

	test('should return the default color (grey500) for undefined input', () => {
		const result = getColor(undefined);
		expect(result).toBe(MUIColor.grey[500]);
	});

	test('should return the input hex color value for a valid hex color', () => {
		const hexColor = '#9e9e9e';
		const result = getColor(hexColor);
		expect(result).toBe(hexColor);
	});

	test('should return the default color (grey500) for an invalid hex color', () => {
		const invalidHexColor = '#ZZZ333';
		const result = getColor(invalidHexColor);
		expect(result).toBe(MUIColor.grey[500]);
	});

	test('should return the default color (grey500) for empty input', () => {
		const result = getColor('');
		expect(result).toBe(MUIColor.grey[500]);
	});
});
