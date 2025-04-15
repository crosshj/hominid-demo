import { whenRunner } from '../../utils/whenConditions';

const modifierFromDef = (modDef) => {
	const { active: activeCondition, ...toApply } = modDef?.props?.props || {};
	if (typeof activeCondition === 'undefined') return { apply: () => {} };

	const apply = (item = {}) => {
		const { cells } = item;
		if (!Array.isArray(cells)) return;
		const { row } = cells.find((x) => typeof x.row !== 'undefined') || {};
		if (typeof row === 'undefined') return;
		const shouldApply = whenRunner(activeCondition, { row });
		if (!shouldApply) return;

		item.style = item.style || {};
		item.style = { ...item.style, ...toApply };

		if (typeof item.style.backgroundColor !== 'undefined') {
			for (const cell of cells) {
				cell.style = cell.style || {};
				cell.style = { ...cell.style, backgroundColor: 'unset' };
			}
		}
		if (typeof item.style.borderBottom !== 'undefined') {
			for (const cell of cells) {
				cell.style = cell.style || {};
				cell.style = { ...cell.style, borderBottom: 'unset' };
			}
		}
		// console.log({
		// 	cells,
		// 	toApply,
		// 	row,
		// 	item,
		// });
	};
	return { apply, def: modDef };
};
export const getModifiers = (args) => {
	return (args?.children || [])
		.filter((x) => x?.props?.type === 'RowModifier')
		.map(modifierFromDef);
};
