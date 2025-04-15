export const parseProps = ({ properties = '' } = {}) => {
	return properties
		.split(',')
		.map((x) => x.trim().split(':'))
		.reduce((acc, [key, value]) => {
			if (key.includes('ESCAPED_COLON')) acc['includesEventProp'] = true;
			acc[key.replace('ESCAPED_COLON', ':')] = value;
			acc[key] = value;
			return acc;
		}, {});
};
