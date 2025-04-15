const minimumItemSize = 15;
const minPercent = minimumItemSize / 100;
const MAX_ITERATIONS = 1000;

const originalAlgo = (value, total, length) =>
	(minimumItemSize * (Number(value) || 1)) / total +
	(100 - minimumItemSize) / length;

const alternateAlgo = ({ all, index }) => {
	let _total = all.reduce((a, o) => a + Number(o.value), 0);
	if (100 / all.length <= minimumItemSize)
		return originalAlgo(all[index].value, _total, all.length);
	const allClone = JSON.parse(JSON.stringify(all));
	_total = allClone.reduce((a, o) => a + Number(o.value), 0);
	let iterations = 0;
	while (iterations++ < MAX_ITERATIONS) {
		const someNotMin = allClone.find(
			(x) => Number(x.value) / _total < minPercent
		);
		if (someNotMin === undefined) break;
		someNotMin.value = Number(someNotMin.value) + 1;
	}
	if (iterations >= MAX_ITERATIONS)
		return originalAlgo(all[index].value, _total, all.length);
	const item = allClone[index];
	return (100 * Number(item.value)) / _total;
};

export const getItemSize = (value, total, length) => {
	const percent =
		typeof value === 'object'
			? alternateAlgo(value)
			: originalAlgo(value, total, length);
	return `${percent}%`;
};
