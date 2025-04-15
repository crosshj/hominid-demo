import _ from 'lodash';

import { Errors } from './knownErrors';
import { Patterns } from './knownPatterns';

const errorsToSkip = ['if', 'oneOf', 'allOf'];

const getFailedPropertyName = (e) => {
	const errorKeywordByPropertyNameGetter = {
		required: (e) => e.params.missingProperty,
		type: (e) => e.keyword,
		default: (e) => {
			if (e.dataPath === '' || e.instancePath === '') {
				return e.params.errors[0].keyword;
			}

			const possibleSources = ['instancePath', 'dataPath'];

			for (const prop of possibleSources) {
				const value = e[prop] + '';
				if (!value.includes('/')) continue;

				return value.split('/')[1].trim();
			}

			return '';
		},
	};

	const getter =
		errorKeywordByPropertyNameGetter[e.keyword] ||
		errorKeywordByPropertyNameGetter['default'];

	return getter(e);
};
const prettifyMessage = (e) => {
	const errorMessage = (e.message + '').toLowerCase();
	if (errorMessage.startsWith('must have required')) {
		return Errors.required;
	}

	//
	if (errorMessage.startsWith('must be >=')) {
		return `Must be greater or equal than ${errorMessage
			.split('>=')[1]
			.trim()}`;
	}
	if (errorMessage.startsWith('must be <=')) {
		return `Must be less or equal than ${errorMessage
			.split('<=')[1]
			.trim()}`;
	}

	//
	if (errorMessage.startsWith('must be >')) {
		return Errors.greaterThan(errorMessage.split('>')[1].trim());
	}
	if (errorMessage.startsWith('must be <')) {
		return Errors.lessThan(errorMessage.split('>')[1].trim());
	}

	if (errorMessage.startsWith('must match pattern')) {
		const fallbackErrorMsg = 'Invalid format.';
		const availablePatterns = Object.entries(Patterns);

		for (const [key, pattern] of availablePatterns) {
			if (!errorMessage.includes(pattern)) continue;

			return Errors.format[key] || fallbackErrorMsg;
		}

		return fallbackErrorMsg;
	}

	if (errorMessage === 'must be equal to one of the allowed values') {
		return (
			'Value entered should be one of: ' +
			e.params.allowedValues.join(', ')
		);
	}

	return _.upperFirst(errorMessage);
};

export const formatErrors = (errorsSrc) => {
	const errorsFormatted = {};

	for (const error of errorsSrc) {
		if (errorsToSkip.includes(error.keyword)) continue;

		const message = prettifyMessage(error);
		if (!message) continue;

		const propertyName = getFailedPropertyName(error);

		errorsFormatted[propertyName] = [message];
	}

	return errorsFormatted;
};
