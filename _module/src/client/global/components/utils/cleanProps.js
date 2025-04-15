export const cleanProps = (props) => {
	const clean = {};
	for (const [k, v] of Object.entries(props)) {
		let value = v;
		if (v === 'false') value = false;
		if (v === 'true') value = true;
		if (k === 'isRequired') continue;
		if (k === 'targetRoute') continue;
		if (k === 'parentForm') continue;
		clean[k] = value;
	}
	// clean.value = clean.value || clean.defaultValue || '';
	// delete clean.defaultValue;
	return clean;
};
