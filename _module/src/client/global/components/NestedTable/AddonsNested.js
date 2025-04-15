// This is used by getGridItems, all cells in a header row are created here before they are rendered
// row => gridItems representing the row
export const getAddonRow = (args) => {
	const { row, headers, maxLevel } = args;
	let thisLevel = row.level + 1;
	let wrapRow = true;
	if (thisLevel > maxLevel) {
		wrapRow = false;
		thisLevel = maxLevel;
	}

	let deeplyNested = args.row._parent;
	while (Array.isArray(deeplyNested?.children)) {
		deeplyNested = deeplyNested.children[0];
	}

	const rowClass =
		`nest-level-${thisLevel} addon cell` + (!row.isOpen ? ' closed' : '');
	const main = [
		...new Array(maxLevel).fill().map((x, i) => ({
			className: `${rowClass} nest-spacer-` + (i + 1),
		})),
		{
			gridColumn:
				maxLevel + 1 + ' / span ' + (headers.length - 2 * maxLevel),
			className: `${rowClass} nest-addon`,
			rowType: 'Addon',
			extensible: true,
			children: row.children,
			row: deeplyNested,
			leftSpacers: new Array(maxLevel).fill(),
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
		...new Array(maxLevel).fill().map((x, i) => ({
			className: `${rowClass} nest-spacer-` + (maxLevel - i) + ' end',
		})),
	];

	if (!wrapRow) return main;

	const rowClassHeader =
		`nest-level-${thisLevel} addon header` + (!row.isOpen ? ' closed' : '');
	const headerRow = [
		...new Array(maxLevel).fill().map((x, i) => ({
			className: `${rowClassHeader} nest-spacer-` + (i + 1),
		})),
		{
			gridColumn:
				maxLevel + 1 + ' / span ' + (headers.length - 2 * maxLevel),
			className: `${rowClassHeader} nest-header`,
		},
		...new Array(maxLevel).fill().map((x, i) => ({
			className:
				`${rowClassHeader} nest-spacer-` + (maxLevel - i) + ' end',
		})),
	];

	const rowClassFooter =
		`nest-level-${thisLevel} addon footer` + (!row.isOpen ? ' closed' : '');
	const footerRow = [
		...new Array(maxLevel).fill().map((x, i) => ({
			className: `${rowClassFooter} nest-spacer-` + (i + 1),
		})),
		{
			gridColumn:
				maxLevel + 1 + ' / span ' + (headers.length - 2 * maxLevel),
			className: `${rowClassFooter} nest-footer`,
		},
		...new Array(maxLevel).fill().map((x, i) => ({
			className:
				`${rowClassFooter} nest-spacer-` + (maxLevel - i) + ' end',
		})),
	];

	return [...headerRow, ...main, ...footerRow];
};

export const attachAddons = (args) => {
	const { nesting, depthRecurser } = args;
	const { atDepth } = depthRecurser;

	const insertAddon = ({ addons, rowItems }) => {
		for (const r of rowItems) {
			if (!r.children) continue;
			r.children.push(...addons);
		}
	};

	for (const [levelKey, level] of Object.entries(atDepth)) {
		const levelIndex = Number(levelKey);
		const addons = (nesting[levelIndex - 1]?.children || []).filter(
			(x) => x.type === 'Addon',
		);
		if (!addons.length) continue;
		const rowItems = [];
		for (const levelItem of level) {
			const searchKey = (levelItem._params || []).join('-');
			const searchList = rowItems.map((x) => (x._params || []).join('-'));
			const previous = searchList.find((rowKey) => rowKey === searchKey);
			if (previous) continue;
			rowItems.push(levelItem);
		}
		if (!rowItems.length) continue;
		insertAddon({ addons, rowItems: rowItems, level: levelIndex });
	}
};
