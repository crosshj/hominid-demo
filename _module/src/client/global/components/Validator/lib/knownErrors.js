export const Errors = {
	required: 'Field is required.',
	numberType: 'Value entered must be a number.',
	stringType: 'Value entered must be a string.',
	integerType: 'Value must be an integer.',
	noNegative: 'Value cannot be negative.',
	greaterThan: (x) => `Please enter a number greater than ${x}.`,
	greaterOrEqualThan: (x) =>
		`Please enter a number greater or equal than ${x}.`,
	lessThan: (x) => `Please enter a number less than ${x}.`,
	pattern: {
		website: 'Value entered must be a valid web address.',
		phone: 'Value entered must follow the pattern: (###)###-####.',
		postalcode_us: 'Value entered must be a valid US postal code.',
		postalcode_canada: 'Value entered must be a valid Canada postal code.',
	},
	format: {
		postalcode_us: 'Value entered must be a valid US postal code.',
		postalcode_canada: 'Value entered must be a valid Canada postal code.',
		time: 'Value entered must be a valid time.',
		email: 'Value entered must be a valid email address.',
		date: 'Value entered must be a valid date.',
		website: 'Value entered must be a valid web address.',
		phone: 'Value entered must follow the pattern: (###)###-####.',
	},
};
