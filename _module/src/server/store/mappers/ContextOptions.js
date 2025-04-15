const OptionsResult = (dbResult = {}, order) => {
	const {
		ID,
		id,
		DisplayValue,
		displayvalue,
		Properties: properties = '',
		parent = '',
		label,
		value,
	} = dbResult;

	const __label = label ?? DisplayValue ?? displayvalue;
	const __value = value ?? ID ?? id;

	return {
		key: '',
		label: __label,
		value: __value,
		order,
		parent,
		properties,
		type: 'Option',
	};
};

const OptionsTransform = (dbResults) => {
	return (dbResults || []).map(OptionsResult);
};

exports.OptionsTransform = OptionsTransform;
