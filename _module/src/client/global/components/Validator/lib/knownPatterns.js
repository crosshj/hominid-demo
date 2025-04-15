export const Patterns = {
	postalcode_us: '([0-9]{5}(-[0-9]{4})?)',
	postalcode_canada: '[A-Z][0-9][A-Z][0-9][A-Z][0-9]',
	website:
		'(https://|http://)?([a-zA-Z0-9]{0,}.)?[a-zA-Z0-9]{2,}(.[a-zA-Z0-9]{2,})(.[a-zA-Z0-9]{2,})?',
	phone: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$',
};
