export const mutateValue = (currentValue, mutateProp) => {
	const { add, subtract, max, min } = mutateProp
		.split(',')
		.map((x) => x.split(':').map((y) => y.trim()))
		.reduce((a, [k, v]) => ({ ...a, [k]: Number(v) }), {});

	currentValue = Number(currentValue) || 0;
	currentValue += Number(add || 0);
	currentValue -= Number(subtract || 0);

	if (currentValue > max) {
		currentValue = max;
	}
	if (currentValue < min) {
		currentValue = min;
	}

	return currentValue;
};
