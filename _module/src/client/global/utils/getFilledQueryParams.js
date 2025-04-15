import _ from 'lodash';
import { getFirstValidValue } from '../components/Flow/SetData/getFirstValidValue';

/**
 * Accepts a string with Query param-like format, i.e
 * starts with `param_` and can potentially have "xml namespaces" to define nested objects, but
 * also "." (dots).
 *
 * The output can be used alongside with lodash's `set` function in order to set
 * nested objects/properties automatically.
 *
 * @example
 * const param = parseParamName('param_processData:myObject.ID');
 *
 * // param = ['processData','myObject','ID']
 * const filledParams = {}
 * _.set(filledParams, param, 1000);
 *
 * //filledParams = { processData: { myObject: { ID: 1000 } } }
 *
 * @param {string} name
 * @returns
 */
const parseParamName = (name) =>
	name.replace('param_', '').replaceAll(':', '.').split('.');

const extractIndexFromFlowArgsPath = ({ path = '' } = {}) => {
	if (!_.isString(path) || !path.includes('[')) {
		return undefined;
	}

	const possibleIndex = path.split('[')[1].split(']')[0];
	return Number.isNaN(Number(possibleIndex))
		? undefined
		: Number(possibleIndex);
};

export const getFilledQueryParams = (
	allProps,
	{ global, flowArgs = {} },
	{ debug = false },
) => {
	const paramProps = Object.entries(allProps).filter(([key]) =>
		key.startsWith('param_'),
	);

	const filledProps = {};

	const sources = {
		flowArgs: {
			...flowArgs,
			index:
				typeof flowArgs.index !== 'undefined'
					? flowArgs.index
					: extractIndexFromFlowArgsPath(flowArgs),
		},
		global,
	};

	for (const [key, value] of paramProps) {
		const name = parseParamName(key);
		const finalValue = getFirstValidValue(value, sources, { debug });

		_.set(filledProps, name, finalValue);
	}

	// we must parse nested objects since we are using JSON.stringify on the app
	// and this function only stringifies high level objects,
	// which leads to unexpected formats on nested ones
	const filledPropsParsed = _.transform(
		filledProps,
		(acc, value, key) => {
			const _value = _.isObject(value) ? JSON.stringify(value) : value;
			_.set(acc, key, _value);
			return acc;
		},
		{},
	);

	return filledPropsParsed;
};
