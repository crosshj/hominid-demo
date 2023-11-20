module.exports = () => {
	const items = [
		{ label: 'Yes', value: 'yes' },
		{ label: 'No', value: 'no' },
		{ label: 'Maybe', value: 'maybe' },
	];
	return JSON.stringify(items);
};
