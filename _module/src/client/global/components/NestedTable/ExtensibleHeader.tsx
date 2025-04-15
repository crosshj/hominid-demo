import { extensible } from '../utils';
import { getItemStyle } from './getItemStyle';

// this is used by index.jsx when rendering a table
// gridItem => HTML/React
export const ExtensibleHeader = (args: any) => {
	const { colDef, row } = args;
	let firstDeeplyNestedChild = row.children[0];
	while (true) {
		if (!firstDeeplyNestedChild?.children) break;
		firstDeeplyNestedChild = firstDeeplyNestedChild.children[0];
	}
	return (
		<div
			key={args.key}
			className={args.className}
			style={{
				gridColumn: args.gridColumn,
				...(args.style || {}),
			}}
		>
			{extensible({
				colDef,
				row: {
					...firstDeeplyNestedChild,
					totals: row.totals,
				},
			})}
		</div>
	);
};

// This is used by getGridItems, all cells in a header row are created here before they are rendered
// row => gridItems representing the row
export const extensibleWrapper = ({ row, headers, maxLevel, nesting }: any) => {
	const thisLevelAlt = nesting[row.level];
	const LevelDef = (thisLevelAlt?.children || []).find((x: any) =>
		row.rowType === 'header' ? x.type === 'Header' : x.type === 'Footer',
	);
	const LevelColumns =
		LevelDef &&
		(LevelDef?.children || []).filter((x: any) => x.type === 'Column');
	if (!(LevelColumns || []).length) return;

	const rowClass =
		`nest-level-${row.level + 1} ${row.rowType}` +
		(!row.isOpen ? ' closed' : '');
	const spacersStart = new Array(maxLevel + 1)
		.fill(undefined)
		.map((_x: any, i) => ({
			className: `${rowClass} nest-spacer-` + (i + 1),
		}));
	const spacersEnd = [
		{
			...row,
			className: `${rowClass} actions`,
		},
		...new Array(maxLevel + 1).fill(undefined).map((_x: any, i) => ({
			className: `${rowClass} nest-spacer-` + (maxLevel + 1 - i) + ' end',
		})),
	];
	const rowStartCol = maxLevel + 2;
	//const rowColSpan = headers.length - 2 * maxLevel - 1;

	const cols = [];
	let currentCursor = rowStartCol;
	const colSpans = LevelColumns.reduce((a: number, o: any) => {
		const autoSpan = a + 1;
		if (o?.props?.span === 'auto') return autoSpan;
		if (typeof o?.props?.span === 'undefined') return autoSpan;
		return a + Number(o?.props?.span);
	}, 0);
	for (const [i, levelCol] of Object.entries(LevelColumns)) {
		if (typeof levelCol !== 'object') continue;
		const { props: levelColProps }: any = levelCol || {};
		const start = currentCursor;
		let span = levelColProps?.span || 1;
		if (span === 'auto') {
			span = headers.length - colSpans + 1 - 3 * maxLevel;
			if (maxLevel === 2) span -= 1;
		}

		const className = [rowClass, `nest-${row.rowType}`];
		const style = getItemStyle(levelColProps) || {};

		cols.push({
			...row,
			gridColumn: [start, span > 0 ? `span ${span}` : span].join(' / '),
			className: className.join(' '),
			extensible: true,
			colDef: levelCol,
			style: i !== '0' ? { padding: '8px 1em', ...style } : style,
		});
		currentCursor += span;
	}
	return [...spacersStart, ...cols, ...spacersEnd];
};
