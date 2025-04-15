import { styled } from '@mui/material';

//TODO: colors with dynamic contrast for n-level nesting
function getColors({ theme, maxLevel: levels, chromeless }) {
	if (chromeless) {
		return new Array(3).fill('unset');
	}
	const lightMode = theme.palette.mode === 'light';
	if (levels === 4) {
		return [
			lightMode ? theme.palette.grey[400] : theme.palette.grey[800],
			lightMode ? theme.palette.grey[300] : theme.palette.grey[700],
			lightMode ? theme.palette.grey[200] : theme.palette.grey[600],
			lightMode ? theme.palette.common.white : theme.palette.grey[900],
		];
	}
	if (levels === 2) {
		return [
			lightMode ? theme.palette.grey[300] : theme.palette.grey[800],
			// 'transparent',
			lightMode ? theme.palette.common.white : theme.palette.grey[900],
		];
	}
	if (levels === 1) {
		return lightMode
			? [theme.palette.common.white, theme.palette.common.white]
			: [theme.palette.grey[900], theme.palette.grey[900]];
	}
	const colors = [
		lightMode ? theme.palette.grey[400] : '#232323',
		lightMode ? theme.palette.grey[200] : '#1c1c1c',
	].slice(0, levels - 1);
	colors.push(lightMode ? theme.palette.common.white : '#131313');

	return colors;
}

export const getColumns = (args, debug) => {
	const { maxLevel, visibleColumns } = args;
	const spacerWidth = maxLevel > 1 ? '0.5em' : '0px';
	const altSpacerWidth = '0px';

	const leftSpacers = new Array(maxLevel > 0 ? maxLevel + 1 : 0)
		.fill()
		.map((x, i) => (i === maxLevel ? altSpacerWidth : spacerWidth));

	const columns = visibleColumns.map((col) => {
		if (typeof col?.width !== 'undefined') return col.width;
		return 'auto';
	});

	const rightSpacers = new Array(maxLevel > 0 ? maxLevel + 1 : 0)
		.fill()
		.map((x, i) => (i === 0 ? altSpacerWidth : spacerWidth));
	if (debug) debugger;
	return { leftSpacers, columns, rightSpacers };
};

const getGridTemplateColumns = (args) => {
	const { leftSpacers, columns, rightSpacers } = getColumns(args);
	return [...leftSpacers, ...columns, ...rightSpacers].join(' ');
};

export const NestedTableContainer = styled('div')((args = {}) => {
	const { theme } = args;
	const levels = getColors(args);
	const gridTemplateColumns = getGridTemplateColumns(args);

	return {
		display: 'grid',
		// marginLeft: '-0.3em',
		gridTemplateColumns,
		'--cell-bg': levels[levels.length - 1],
		'--nest-border-color': 'transparent',
		'--nest-link-color': theme.palette.primary.main,
		'--nest-level-1-bg': levels[0],
		'--nest-level-2-bg': levels[1],
		'--nest-level-3-bg': levels[2],
		'--nest-level-4-bg': levels[3],
	};
});
