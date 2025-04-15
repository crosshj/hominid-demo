import _ from 'lodash';

import { StateManager } from '../../../../state/state';

import { clone } from '../../../utils';
import {
	getIncludesProps,
	ApplyStringFormatters,
	getWhenProps,
} from '../../../utils/parseProperties';

const toString = (v = {}) => {
	return Array.isArray(v) ? v.join(',') : JSON.stringify(v);
};

export const fillToken = (
	token,
	currentValue,
	originalValue,
	dataSources,
	debug,
) => {
	if (_.isUndefined(originalValue)) debugger;

	const { key, match, source, path: pathIntact, formatter } = token;

	if (!(source in dataSources)) {
		console.warn(
			`Unknown data source for "${source}". Stateful prop not replaced.`,
		);
		return;
	}

	const path = pathIntact
		.split(/[.[](?!hidden)/)
		.map((x) => x.replace(/\]$/, ''));
	let valueToFill = _.get(dataSources, [source, ...path]);

	if (_.isUndefined(valueToFill)) return undefined;

	valueToFill = ApplyStringFormatters(valueToFill, formatter, { debug });

	if (_.isUndefined(currentValue)) {
		// ? why return undefined?
		return undefined;
	}

	if (_.isObject(valueToFill)) {
		// ? It is possible to display array/object data as string on Typography, using "textContent" prop.
		// ? Therefore if it is textContent, we must parse into string,
		// ? Otherwise, we must return the object.
		if (key === 'textContent') {
			valueToFill = toString(valueToFill);
		} else {
			return valueToFill;
		}
	}

	let valueFilled = String(currentValue).replace(match, String(valueToFill));

	if (_.isNumber(valueToFill) && !Number.isNaN(Number(valueFilled))) {
		valueFilled = Number(valueFilled);
	}

	return valueFilled;
};

const getDataSources = ({ __rowTotals, __rowStateKey, __rowIndex, debug }) => {
	const global = clone(StateManager.get(undefined));
	const row = clone(
		StateManager.get(`${__rowStateKey}[${__rowIndex}]`, false, {}),
	);
	Object.assign(row, { totals: __rowTotals, index: __rowIndex });

	return {
		row,
		global,
	};
};
export const fill = (propsIntact, statefulProps, { theme } = {}) => {
	const dataSources = getDataSources(propsIntact);
	dataSources.theme = theme;
	let propsFilled = {};

	for (const [key, statefulProp] of Object.entries(statefulProps)) {
		const { tokens, originalValue } = statefulProp;

		let potentiallyFilledValue;
		let shouldStore = true;

		// DEPRECATE:
		if (
			tokens.length === 1 &&
			tokens[0].matchType !== 'when' &&
			tokens[0].source &&
			!tokens[0].path.includes('_') &&
			!tokens[0].match.includes('{{')
		) {
			const { source, path } = tokens[0];
			const value = _.get(dataSources[source], path);
			_.set(propsFilled, key, value);
			continue;
		}

		for (const token of tokens) {
			if (token.matchType === 'when') {
				shouldStore = false;
			}

			const currentValue =
				potentiallyFilledValue || propsFilled[key] || originalValue;

			potentiallyFilledValue = fillToken(
				token,
				currentValue,
				originalValue,
				dataSources,
				propsIntact.debug,
			);
		}

		if (shouldStore) {
			_.set(propsFilled, key, potentiallyFilledValue);
		}
	}

	const whenPropsFilled = getWhenProps(propsIntact, dataSources);
	const includesPropsFilled = getIncludesProps(propsIntact, dataSources);

	return {
		...whenPropsFilled,
		...includesPropsFilled,
		...propsFilled,
	};
};
