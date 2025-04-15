import { isAfter, isBefore, isEqual, format, isSameDay } from 'date-fns';

import Ajv from 'ajv';
import AddFormats from 'ajv-formats';
import CustomErrors from 'ajv-errors';

import { formatErrors } from './lib/formatErrors';

const ajv = new Ajv({
	allErrors: true,
	strictTypes: false,
	formats: { allowedUnknown: true },
	code: { optimize: false },
});

CustomErrors(ajv);
AddFormats(ajv, { mode: 'full', keywords: true });

ajv.addKeyword({
	keyword: 'dateMinimum',
	error: {
		message: (errorCtx) => {
			return `Date must be after or equal ${format(
				new Date(errorCtx.schema),
				'yyyy-MM-dd',
			)}`;
		},
	},
	validate: (dateMinimum, dateProvided) => {
		const _dateProvided = new Date(dateProvided);
		const _dateMinimum = new Date(dateMinimum);

		const isAfterOrEqual =
			isAfter(_dateProvided, _dateMinimum) ||
			isEqual(_dateProvided, _dateMinimum);

		return isAfterOrEqual;
	},
});

ajv.addKeyword({
	keyword: 'dateExclusiveMinimum',
	error: {
		message: (errorCtx) => {
			return `Date must be after ${format(
				new Date(errorCtx.schema),
				'yyyy-MM-dd',
			)}`;
		},
	},
	validate: (dateExclusiveMinimum, dateProvided) => {
		const _dateProvided = new Date(dateProvided);
		const _dateMinimum = new Date(dateExclusiveMinimum);

		const isAfterAndNotEqual =
			isAfter(_dateProvided, _dateMinimum) &&
			!isEqual(_dateProvided, _dateMinimum);

		return isAfterAndNotEqual;
	},
});

ajv.addKeyword({
	keyword: 'dateMaximum',
	error: {
		message: (errorCtx) => {
			return `Date must be before or equal ${format(
				new Date(errorCtx.schema),
				'yyyy-MM-dd',
			)}`;
		},
	},
	validate: (dateMaximum, dateProvided) => {
		const _dateProvided = new Date(dateProvided);
		const _dateMaximum = new Date(dateMaximum);

		return (
			isBefore(_dateProvided, _dateMaximum) ||
			isEqual(_dateProvided, _dateMaximum)
		);
	},
});

ajv.addKeyword({
	keyword: 'dateExclusiveMaximum',
	error: {
		message: (errorCtx) => {
			return `Date must be before ${format(
				new Date(errorCtx.schema),
				'yyyy-MM-dd',
			)}`;
		},
	},
	validate: (dateExclusiveMaximum, dateProvided) => {
		const _dateProvided = new Date(dateProvided);
		const _dateExclusiveMaximum = new Date(dateExclusiveMaximum);

		const isBeforeAndNotEqual =
			isBefore(_dateProvided, _dateExclusiveMaximum) &&
			!isEqual(_dateProvided);

		return isBeforeAndNotEqual;
	},
});

export const validate = ({ schema, data }) => {
	const validate = ajv.compile(schema);
	const valid = validate(data);
	const errors = valid === false ? formatErrors(validate.errors) : {};
	return { valid, errors };
};
