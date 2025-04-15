import { attachAddons, getAddonRow } from './AddonsNested';
import { extensibleWrapper } from './ExtensibleHeader';
import { getItemStyle } from './getItemStyle';

const getRowHeader = (args) => {
	const eWrap = extensibleWrapper(args);
	if (Array.isArray(eWrap)) return eWrap;

	const { row, headers, maxLevel, nesting } = args;
	const spans = [];
	const showHeaderTotals =
		row.rowType && row.rowType === 'header' && row.totals;
	// !row.isOpen && row.rowType && row.rowType === 'header' && row.totals;
	const showFooterTotals = false;
	//row.isOpen && row.rowType && row.rowType === 'footer' && row.totals;
	let totals = [];
	if (showFooterTotals || showHeaderTotals) {
		const toTotal = headers.filter((x) => x.total);
		for (const header of toTotal) {
			totals.push([header.field, row.totals[header.field]]);
		}
	}
	const headerRenderer = headers.reduce(
		(a, o) => ({ ...a, [o.field]: o }),
		{},
	);

	const rowClass =
		`nest-level-${row.level + 1} ${row.rowType}` +
		(!row.isOpen ? ' closed' : '');

	const thisLevel = nesting[row.level];

	if (row._type === 'no-header' || thisLevel.variant === 'no-header') {
		return [
			...new Array(maxLevel).fill().map((x, i) => ({
				className: `${rowClass} nest-spacer-` + (i + 1),
			})),
			{
				gridColumn:
					maxLevel +
					1 +
					' / span ' +
					(headers.length - 2 * maxLevel - 1 - totals.length),
				className: `${rowClass} nest-${row.rowType}`,
			},
			...totals.map(() => ({})),
			{
				className: `${rowClass} nest-${row.rowType}`,
			},
			...new Array(maxLevel).fill().map((x, i) => ({
				className: `${rowClass} nest-spacer-` + (maxLevel - i) + ' end',
			})),
		];
	}
	spans.push(
		...new Array(maxLevel).fill().map((x, i) => ({
			className: `${rowClass} nest-spacer-` + (i + 1),
		})),
	);

	spans.push({
		...row,
		gridColumn:
			maxLevel +
			1 +
			' / span ' +
			(headers.length - 2 * maxLevel - 1 - totals.length), // - 1),
		className: rowClass + ' nest-' + row.rowType,
	});

	if (showFooterTotals || showHeaderTotals) {
		spans.push(
			...totals.map(([k, v]) => ({
				...row,
				className: rowClass,
				renderCell: headerRenderer[k]?.renderCell,
				value: v,
			})),
		);
	}
	spans.push({
		...row,
		className: `${rowClass} actions`,
	});
	spans.push(
		...new Array(maxLevel).fill().map((x, i) => ({
			className: `${rowClass} nest-spacer-` + (maxLevel - i) + ' end',
		})),
	);
	return spans;
};

const getRowCells = ({ row, headers, dispatch }) => {
	if (!row.isOpen) return [];

	const spans = [];
	const rowClass = `nest-level-${row.level} ${row.rowType}${
		row._type === 'no-header' ? ' no-underline' : ''
	}`;
	const cells = (row) =>
		headers.map((header) => {
			return {
				...header,
				value: row[header.field],
				className: [header.field, header.className].join(' ').trim(),
			};
		});
	const allCells = Object.entries(cells(row));
	for (const [i, cell] of allCells) {
		if (cell?.endSpacer) {
			spans.push({
				className:
					rowClass +
					' nest-spacer-' +
					(allCells.length - Number(i)) +
					' end',
			});
			continue;
		}
		if (cell?.spacer) {
			spans.push({
				className: rowClass + ' nest-spacer-' + (Number(i) + 1),
			});
			continue;
		}
		let cellRenderer = cell.renderCell
			? cell.renderCell
			: (cell) => cell.value;

		const cellStyle = {};
		const cellStyleEntries = Object.entries(cell.style || {});
		for (const [k, v] of cellStyleEntries) {
			// use "cell."" prefixed property without the prefix
			if (k.startsWith('cell.')) {
				cellStyle[k.replace(/^cell\./, '')] = v;
				continue;
			}
			// do not set property if a prefixed property exists
			if (cellStyleEntries.find(([k2]) => k2 === 'cell.' + k)) continue;
			// otherwise...
			cellStyle[k] = v;
		}

		spans.push({
			row,
			value: cell.value,
			field: cell.field,
			renderCell: (props) =>
				cellRenderer({ ...cell, colDef: cell, dispatch, ...props }),
			isOpen: row.isOpen,
			style: cellStyle,
			className: (rowClass + ' nest-cell ' + cell.className).trim(),
		});
	}
	return spans;
};

const recurse = (obj, fnArray, args = {}) => {
	const children = Array.isArray(obj) ? obj : obj.children;
	if (!children) {
		for (const fn of fnArray) {
			fn.step(obj, args);
		}
		return;
	}
	for (const child of children) {
		let allArgs = {};
		for (const fn of fnArray) {
			allArgs = { ...allArgs, ...fn.args(obj, args) };
		}
		recurse(child, fnArray, allArgs);
	}
};

class DepthRecurser {
	depth = 0;
	atDepth = [];
	constructor() {
		this.args = this.step.bind(this);
		this.step = this.step.bind(this);
	}
	step(child, { depth = -1 } = {}) {
		this.atDepth[depth + 1] = this.atDepth[depth + 1] || [];
		this.atDepth[depth + 1].push(child);
		this.depth = this.depth < depth ? depth : this.depth;
		return { depth: depth + 1 };
	}
}
class TotalsRecurser {
	toTotal = [];
	constructor(toTotal, debug) {
		this.debug = debug;
		this.toTotal = toTotal;
		this.step = this.step.bind(this);
	}
	args(child, { parents = [] } = {}) {
		return { parents: [...parents, child] };
	}
	step(child, { parents = [] } = {}) {
		if (!parents.length) return;
		for (const { field, total } of this.toTotal) {
			let totalKey = field;
			if (
				typeof total === 'string' &&
				!['total', 'true'].includes(total)
			) {
				totalKey = total;
			}
			if (typeof child[totalKey] === 'undefined') continue;
			for (const parent of parents) {
				parent.totals = parent.totals || {};
				parent.totals[totalKey] = parent.totals[totalKey] || 0;
				parent.totals[totalKey] += Number(child[totalKey]);
			}
		}
	}
}
const nester = (row, level, parentOpen, open = {}, maxLevel, nesting) => {
	let isOpen = open === '*';
	isOpen = isOpen || ((level === 0 || parentOpen) && open[row._nestId]);

	const thisLevel = nesting[level];
	const collapsible = thisLevel?.collapsible + '' !== 'false';
	if (!collapsible || thisLevel?.variant === 'no-header') {
		isOpen = true;
	}

	if (row.type === 'Addon') {
		return { ...row, level, rowType: 'addon', isOpen: parentOpen };
	}

	if (!row.children) {
		return { ...row, level, rowType: 'cell', isOpen: parentOpen };
	}

	const nestedChildren = row.children
		.map((x) =>
			nester(
				{ _type: row._type, _parent: row, ...x },
				level + 1,
				isOpen,
				open,
				maxLevel,
				nesting,
			),
		)
		.flat();

	const rowItems = [];
	//if (maxLevel > 1) {
	const headerDef = {
		...row,
		row,
		level,
		rowType: 'header',
		collapsible,
		isOpen,
		parentOpen,
	};
	// if (notCollapsible) {
	// 	headerDef.collapsible = false;
	// }
	rowItems.push(headerDef);
	//}

	if (isOpen) {
		rowItems.push(...nestedChildren);
		//if (maxLevel > 1) {
		rowItems.push({
			...row,
			level,
			rowType: 'footer',
			isOpen,
			parentOpen,
		});
		//}
	}

	// if (maxLevel > 1) {
	rowItems.push({
		...row,
		level,
		rowType: 'row-spacer',
	});
	// }
	return rowItems;
};

export function getGridItems({
	rows: _rows,
	open,
	visibleColumns,
	dispatch,
	nesting,
	headerHidden,
	toTotal,
	debug,
}) {
	const rows = JSON.parse(JSON.stringify(_rows));

	const _toTotal = [...visibleColumns.filter((x) => x.total), ...toTotal];

	const depthRecurser = new DepthRecurser();
	const totalsRecurser = new TotalsRecurser(_toTotal, debug);
	recurse(rows, [depthRecurser, totalsRecurser]);
	attachAddons({ nesting, rows, depthRecurser });

	const maxLevel = depthRecurser.depth;

	const headers = [
		...new Array(maxLevel + 1).fill({ spacer: true }),
		...visibleColumns,
		...new Array(maxLevel + 1).fill({ endSpacer: true }),
	].map((x) => {
		const className = ['table-header'];
		if (x.align === 'right') className.push('justifyEnd');
		if (x.align === 'left') className.push('justifyStart');
		if (x.align === 'center') className.push('justifyCenter');
		return {
			isOpen: true,
			...x,
			style: getItemStyle(x),
			className: className.join(' '),
			classNameSrc: x.className,
		};
	});

	// const nRows = rows.map((x) => nester(x, 0, true, open, maxLevel));
	const nestedRows = rows
		.map((x) => nester(x, 0, true, open, maxLevel, nesting))
		.flat();

	if (debug) {
		console.log({
			_: 'NestedTable',
			nestedRows,
		});
	}

	const rowSpans = [];

	for (const row of nestedRows) {
		if (row?.type === 'Addon') {
			rowSpans.push(...getAddonRow({ row, headers, maxLevel }));
			continue;
		}
		if (!row.children) {
			const rowContainer = {
				cells: getRowCells({ row, headers, maxLevel, dispatch }),
			};
			rowSpans.push(rowContainer);
			continue;
		}
		rowSpans.push(...getRowHeader({ row, headers, maxLevel, nesting }));
	}
	if (headerHidden) {
		return { maxLevel, items: rowSpans };
	}
	return { maxLevel, items: [...headers, ...rowSpans] };
}
