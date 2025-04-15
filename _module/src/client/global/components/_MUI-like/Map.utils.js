import { ApplyStringFormatters } from '../../utils/parseProperties';

const getRegex = (objectName) => {
	const pattern = [
		'\\{?\\{?', // {{
		'\\s*', // optional whitespace
		objectName, // source object name
		'[._]', // a dot or an underscore
		'([a-zA-Z0-9]+)', // alphanumeric property name
		'\\s*', // optional whitespace
		'\\}?\\}?', // }}
	].join('');

	return new RegExp(pattern, 'g');
};
//exported only for testing purposes

const getTokenized = (propValue = '') => {
	if (!propValue) return [];

	const tokenized = [];
	const matches = propValue.match(/\{\{(.+?)\}\}/gm);

	if (matches == null) {
		return [];
	}

	for (const x of matches) {
		if (!x.includes(':')) continue;

		const [prop, formatter] = x
			.replace('{{', '')
			.replace('}}', '')
			.replace('item_', '')
			.split(':');

		tokenized.push([prop, formatter]);
	}

	return tokenized;
};

export const bindItem = (child, item) => {
	try {
		const itemKeys = Object.keys(item);
		const childSrc = JSON.stringify(child);

		const tokenizedWithFormatters = getTokenized(childSrc);

		let boundSrc = childSrc.replace(getRegex('item'), (match, prop) => {
			const isBracketPaddedMatch = match.trim().length === match.length;

			let replacement = isBracketPaddedMatch
				? item[prop]
				: ` ${item[prop]} `;

			for (const [_prop, formatter] of tokenizedWithFormatters) {
				if (prop !== _prop) continue;

				replacement = ApplyStringFormatters(replacement, formatter);
			}

			if (itemKeys.includes(prop)) return replacement;
			return match;
		});

		for (const [_, formatter] of tokenizedWithFormatters) {
			boundSrc = boundSrc.replaceAll(`:${formatter}}}`, '');
		}

		return JSON.parse(boundSrc);
	} catch (e) {
		return child;
	}
};
