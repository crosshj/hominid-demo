import _, { hasIn } from 'lodash';
import parseValue from './parseValue';
import { format, formatDistance } from 'date-fns';
import { whenParser, whenRunner } from './whenConditions';
import { DateTime } from './parseDates';

const getTokenMatches = (x) => x.match(/{{\s*(\w+)_([\w\s.,[\]:/\\]+)\s*}}/g);
const getTokenMatchesNoDelim = (x) => x.match(/(\w+)_([\w\s.,[\]:/\\]+)/g);
const removeTokenBrackets = (x) => {
	return x.replace('{{', '').replace('}}', '').trim();
};

export const parseProperties = (properties) => {
	if (!properties) return;
	return (properties || '')
		.replace(/\\,/g, 'ESCAPED_COMMA')
		.replace(/\\:/g, 'ESCAPED_COLON')
		.replace(/\\n/g, 'ESCAPED_LINEFEED')
		.replace(/\\blank/g, 'ESCAPED_BLANK')
		.split(',')
		.reduce((acc, propIn = '') => {
			const prop = propIn.trim();
			const [name, mainValue, ...rest] = prop.split(':');
			const value = [mainValue, ...rest].join(':');
			if (!name || !value) return acc;
			const newValue = parseValue(
				value
					.trim()
					.replace(/ESCAPED_COMMA/g, ',')
					.replace(/ESCAPED_COLON/g, ':')
					.replace(/ESCAPED_LINEFEED/g, '\n')
					.replace(/ESCAPED_BLANK/g, ''),
			);
			const descapedName = name?.trim().replace(/ESCAPED_COLON/g, ':');
			return {
				...acc,
				[descapedName]: newValue,
			};
		}, {});
};

// NOTE: see also getTokenizableProps (below) which does a similar thing
export const replaceTokens = (state = {}, text) => {
	if (!text.includes('{{')) return text;
	const replacer = (match, pathSrc) => {
		try {
			let path = pathSrc.trim();
			// TODO: support AS syntax, allows extra formatting for TextField tokens
			// if (path.includes(' AS ')) {
			// 	path = pathSrc.split(' AS ')[0].trim();
			// }

			// let formatter;
			// if (path.includes(':')) {
			// 	[path, formatter] = path.split(':');
			// }

			// try with lodash
			// console.log({ state, path });
			const _value = _.get(state, path.replace('global_', ''));
			if (typeof _value !== 'undefined') return _value;

			// fall back to javascript
			const replaced = path
				.trim()
				.split('.')
				.reduce((a, o) => a[o] || {}, state);

			// do not show object
			if (typeof replaced === 'object') {
				if (!Object.keys(state).length || state.loading) return '';
				console.log('Attempting to show JSON in a text replacer:', {
					replaced,
					state,
					path: path.trim(),
				});
				//return JSON.stringify(replaced, null, 2);
				return '';
			}
			return replaced || '';
		} catch (e) {
			console.log(e);
			return '';
		}
	};
	//if (text.includes('global_')) debugger;
	const replaced = text.replace(/{{(.*?)}}/gm, replacer);
	//console.log({ state, text, replaced });
	//if (!Object.keys(state).length) debugger;
	if (replaced.includes('[object Object]')) {
		// console.log('WARNING: failed to replace value for text: ');
		console.log({ text, replaced, state });
		return '';
	}
	return replaced;
};

export const parseUseData = (prop = '') => {
	const split = prop.split(',');
	return split.map((x) => ({
		key: x.split(':').shift(),
		intent: x.split(':').pop() || 'R',
	}));
};

export const enhanceResults = (results) => {
	if (!_.isString(results) && !Array.isArray(results)) return results;

	if (_.isString(results)) {
		try {
			results = JSON.parse(results);
		} catch (e) {
			return results;
		}
	}

	const EnhancedResultMap = (result) => {
		for (const [key, value] of Object.entries(result)) {
			//properties with _JSON in name
			if (key.toLowerCase().includes('_json')) {
				result[key.replace('_json', '').replace('_JSON', '')] =
					parseValue(value);
			}
		}
		return result;
	};

	if (!Array.isArray(results)) return results;

	return [].concat(results).map(EnhancedResultMap);
};

export const getWhenProps = (propsIntact, dataSources) => {
	const whenPropsEntries = Object.entries(propsIntact).filter(
		([, value]) => _.isString(value) && value.includes('WHEN '),
	);

	const hasWhenProps = whenPropsEntries.length > 0;
	if (!hasWhenProps) {
		propsIntact.debug &&
			console.log({
				_: 'getWhenProps: DEBUG - early return - no WHEN conditions to parse',
				info: { propsIntact, dataSources },
			});

		return {};
	}

	try {
		const whenPropsFilled = whenPropsEntries.reduce(
			(propsFilled, [k, v]) => {
				propsFilled[k] = whenRunner(v, dataSources);
				return propsFilled;
			},
			{},
		);

		propsIntact.debug &&
			console.log({
				_: 'getWhenProps: debug RESULT',
				info: { propsIntact, dataSources, whenPropsFilled },
			});

		return whenPropsFilled;
	} catch (e) {
		console.error('Error on getWhenProps', e, { propsIntact, dataSources });
		return {};
	}
};

export const getIncludesProps = (propsIntact, dataSources) => {
	const { debug } = propsIntact;
	const hasIncludes = _.values(propsIntact).some(
		(x) => _.isString(x) && x.includes('INCLUDES'),
	);

	if (!hasIncludes) {
		debug &&
			console.log({
				_: 'getIncludesProps: DEBUG - early return - no INCLUDES condition to parse',
				info: { propsIntact, dataSources },
			});

		return {};
	}

	const propsParsed = {};

	const getValue = (prop) => {
		// |       prop          |   source   |     path     |
		// |_____________________|____________|______________|
		// |  global_thisAndThat |  global    | thisAndThat  |
		// |  static_1           |  static    |      1       |
		// |  row_myID           |  row       |     myID     |

		const [source, path] = prop.split('_').map((x) => x.trim());

		const pathSplit = path.split(/\.(?!hidden)/);

		debug && console.log({ source, pathSplit });

		if (source === 'static') {
			return path;
		}

		if (source in dataSources) {
			return _.get(dataSources, [source, ...pathSplit]);
		}

		if (source in propsIntact) {
			return _.get(propsIntact, [source, ...pathSplit]);
		}

		debug && console.log('undefined value', { source, pathSplit });

		return undefined;
	};

	const getLeftAndRightValues = (value) => {
		const [leftIntact, rightIntact] = value.split('INCLUDES');

		const leftValue = getValue(leftIntact);
		const rightValue = getValue(rightIntact);

		return [leftValue, rightValue];
	};

	for (const [k, v] of Object.entries(propsIntact)) {
		if (!v?.includes || !v.includes('INCLUDES')) continue;

		const valueWithoutBrackets = removeTokenBrackets(v);

		const [left, right] = getLeftAndRightValues(valueWithoutBrackets);

		if (!Array.isArray(left)) {
			_.set(propsParsed, [k], false);
			continue;
		}

		const actuallyIncludes = left.some((x) => String(x) === String(right));

		_.set(propsParsed, [k], actuallyIncludes);
	}

	debug &&
		console.log({
			_: 'getIncludesProps: debug RESULT',
			info: { propsParsed },
		});

	return propsParsed;
};

/**
 *	Looks for tokenizable values/variables and returns related data, such as "{{global_prop}}" or "row_prop"
 * @param {{}} theseProps - props to look after
 * @param {boolean} withGlobal - whether should look for props that start with "global_" or not
	@example
	const componentProps = {
				textContent: "row_firstName"
				...otherProps,
	}

	getTokenizableProps(componentProps)

	// In this case, the return will be
	[{
				"key": "textContent",
				"match": "row_firstName",
				"source": "row",
				"path": "firstName"
	}]
	* @note function replaceTokens(), inside this same file, does a similar thing. Might fit your need.

	* @returns {Array<{
			key: string,
			path: string,
			source: string,
			match: string,
			formatter?: string,
			matchType?: string,
		}>} tokens Array
	*
 */
const getTokenizableProps = (theseProps, withGlobal) => {
	const matchToSourcePath = (match) => {
		let formatter;
		let [source, path] = removeTokenBrackets(match)
			.split('_')
			.map((x) => x.trim());

		if (typeof path !== 'string')
			return [source, undefined, formatter && formatter.trim()];

		if (path.includes(':')) {
			let formatterRest = [];
			[path, ...formatterRest] = path.split(':');
			formatter = formatterRest.join(':');
		}
		if (path.includes(' ')) {
			path = path.split(' ').shift();
		}
		return [source, path, formatter && formatter.trim()];
	};

	const propsReduce = (all, [key, value]) => {
		if (_.isUndefined(value?.match)) return all;
		if (_.isUndefined(value?.includes)) return all;
		if (!withGlobal && value.includes('global_')) return all;
		if (value.includes('INCLUDES')) return all;

		if (value.includes('WHEN')) {
			const whenConfig = whenParser(value);

			for (const { when } of whenConfig.conditions) {
				const [source, path, formatter] = matchToSourcePath(when);

				all.push({
					key,
					matchType: 'when',
					match: when,
					source,
					path,
					formatter,
				});
			}

			return all;
		}

		//TODO: should also assume that INCLUDES-type props can be tokenized

		//THIS REGEX PATTERN HANDLES STRINGS LIKE {{ source_path }}
		let tokenMatches = value.includes('{{')
			? getTokenMatches(value)
			: getTokenMatchesNoDelim(value.trim());
		if (!tokenMatches) return all;

		for (const match of tokenMatches) {
			const [source, path, formatter] = matchToSourcePath(match);
			all.push({ key, match, source, path, formatter });
		}
		return all;
	};
	return Object.entries(theseProps).reduce(propsReduce, []);
};
export { getTokenizableProps };

const fillToken = (token, currentFinalValue, dataSources) => {
	if (token?.path?.includes(']') && !token?.path?.includes('[')) {
		token.path = token.path.split(']').shift();
		token.match = token.match.split(']').shift();
	}

	token.value = _.get(dataSources[token.source], token.path);

	let finalValue = currentFinalValue.replace(token.match, token.value);

	// if "value" is an array and "finalValue" is a array string joined by commas,
	// then "finalvalue" should be original array
	if (Array.isArray(token.value) && finalValue === token.value.join(',')) {
		finalValue = token.value;
	}

	// if "value" is an object and "finalValue" is "[object Object]",
	// then "finalValue" should be original object
	if (_.isObject(token.value) && finalValue === '[object Object]') {
		finalValue = token.value;
	}

	// console.log({ finalValue });

	return finalValue;
};

/**
 * turns `global_myArray[0]` into `global_myArray.0`
 *
 * and `global_anotherArray[10].key` into `global_anotherArray.10.key`
 *
 * this only works for NUMBERS between brackets, ignoring chars.
 *
 * @param {string} path
 */
const toLodashNumberArrayNotation = (path = '') => {
	if (typeof path !== 'string') return path;

	if (!path.includes('[')) {
		return path;
	}

	const index = matchIndex(path);

	if (_.isUndefined(index)) {
		return path;
	}

	const indexBetweenBrackets = '[' + index + ']';

	// `global_myArray[0]` => `global_myArray.0`
	return path.replace(indexBetweenBrackets, '.' + index);
};
export const fillPropsWithTokens = (theseProps, dataSources, sourceOrder) => {
	const knownPropsSources = ['row', 'flowArgs', 'global', 'results'];

	const filledProps = {};
	sourceOrder = sourceOrder || [...knownPropsSources];

	for (const [k, v] of Object.entries(theseProps)) {
		if (typeof v !== 'string') {
			filledProps[k] = v;
			continue;
		}

		const sourcesToUse = sourceOrder.filter((x) => v.includes(x));

		if (!sourcesToUse.length) {
			filledProps[k] = v;
			continue;
		}

		let finalValue = toLodashNumberArrayNotation(v);

		for (const source of sourcesToUse) {
			if (!sourceOrder.includes(source)) continue;

			if (finalValue === source) {
				finalValue = dataSources[source];
				continue;
			}

			// * source is one of "known props sources", either "global", "flowArgs"...
			// * finalValue can be "global_something[flowArgs.index]", a complex path, with multiple sources
			// ? our implementation relies on handling a source at a time
			// ? so we must
			// * 1. format finalValue to ensure "flowArgs.index" becomes "flowArgs_index" (format recognized by tokenizable matcher)
			// * 2. check what's the source we are handling right now and ensure tokenizable matcher won't match it

			// ? example => trying to fill global_something[flowArgs.index] with global and flowArgs.
			// * this means that sources are global and flowArgs, and we will fill them one at a time.
			// ? 1st iteration, "source" is "flowArgs":
			// ? 		finalValue: "global_something[flowArgs.index]"
			// ? 		workingCopy: "something[flowArgs_index]"
			// ? 		finalValue is filled, becoming: "global_something[2]"
			// ? 2nd iteration, "source" is "global":
			// ? 		finalValue: "global_something[2]"
			// ? 		workingCopy: "global_something[2]"
			// ? 		finalValue is filled, becoming: "global_something[2]"
			// ? in each of these cases, only the source is matched

			let workingCopy = finalValue.replaceAll(source + '.', source + '_');
			finalValue = finalValue.replaceAll(source + '.', source + '_');

			for (const sourceToIgnore of knownPropsSources.filter(
				(x) => x !== source,
			)) {
				workingCopy = workingCopy
					.replaceAll(sourceToIgnore + '.', '')
					.replaceAll(sourceToIgnore + '_', '');
			}

			const tokens = getTokenizableProps({ workingCopy }, true);

			for (const token of tokens.filter((x) => x.key === 'workingCopy')) {
				finalValue = fillToken(token, finalValue, dataSources);
			}
		}

		filledProps[k] = finalValue;
	}
	return filledProps;
};

export const matchIndex = (path) => {
	if (!_.isString(path)) return undefined;

	if (path.includes('[')) {
		const getIndexRegExp = /\[(\d+?)\]/;
		const possibleIndexes = getIndexRegExp.exec(path);

		return Array.isArray(possibleIndexes)
			? Number(possibleIndexes[1])
			: undefined;
	}

	if (path.includes('.')) {
		return Number(_.split(path, '.').pop());
	}

	return undefined;
};

/**
 *
 * @param {*} propsSrc
 * @param {*} props
 * @returns
 */
export const applyInputProps = (propsSrc, props) => {
	const { inputProps, InputProps } = propsSrc?._src || {};

	let inputPropsDef;
	let inputPropsTarget;
	if (typeof inputProps === 'string') {
		inputPropsDef = inputProps;
		inputPropsTarget = 'inputProps';
	}
	if (typeof InputProps === 'string') {
		inputPropsDef = InputProps;
		inputPropsTarget = 'InputProps';
	}
	if (!inputPropsDef) return;

	const propString = inputPropsDef
		.replace(/\\:/g, 'ESCAPED_COLON')
		.split(/[;,]+/)
		.map((keyvalue) => keyvalue.trim().split(':'));
	props[inputPropsTarget] = {};
	for (let [k, v] of propString) {
		if (k === 'min' && v === 'TODAY') {
			v = format(new Date(), 'yyyy-MM-dd') + 'T00:00';
		}
		if (k === 'max' && v === 'TODAY') {
			v = format(new Date(), 'yyyy-MM-dd') + 'T23:59';
		}

		props[inputPropsTarget][k] = v.replace(/ESCAPED_COLON/g, ':');
	}
};

/**
 * XML namespaced properties are abused/used here to indicate a hard-coded transformation
 * @example
 * ```
 * withNamespaced({ sx:display:"none" });
 * // returns { sx: { display: "none" } }
 * ```
 * @param {*} propertiesObj
 * @returns an object where all properties like `namespace:prop` are replaced with `namespace.prop`
 */
export const withNamespaced = (propertiesObj) => {
	const _namespaced = {};
	for (const [k, v] of Object.entries(propertiesObj)) {
		if (!k.includes(':')) {
			_namespaced[k] = !_.isUndefined(v) ? v : _namespaced[k];
			continue;
		}
		const [ns, propNameSrc] = k.split(':').map((x) => x.trim());

		const [actualPropName = '', ...moreNesting] = propNameSrc
			.split('-')
			.map((x) => x.trim());

		const path = [ns, actualPropName];

		for (const evenMoreNestedProp of moreNesting) {
			path.push(evenMoreNestedProp);
		}

		_namespaced[ns] = _namespaced[ns] || {};
		_.set(_namespaced, path, v);
	}
	return _namespaced;
};

//TODO: should date formats below be using parseDates to localize?

export const StringFormatters = {
	capitalize: (string) => {
		return string[0].toUpperCase() + string.slice(1);
	},
	date: (value) => {
		const _value = DateTime.assume(value);
		return format(new Date(_value), 'MM/dd/yy');
	},
	time: (value) => {
		const _value = DateTime.assume(value);
		return format(new Date(_value), `hh:mm:ss a`);
	},
	datetime: (value) => {
		const _value = DateTime.assume(value);
		return format(new Date(_value), `MM/dd/yy hh:mm:ss a`);
	},
	dateformat: (value, formatString = `MM/dd/yy hh:mm a`) => {
		const _value = DateTime.assume(value);
		return format(new Date(_value), formatString);
	},
	datedistancenoassume: (value, secondDate) => {
		const date1 = secondDate ? new Date(secondDate) : new Date();
		const date2 = new Date(value);
		const friendlyDate = formatDistance(date2, date1, { addSuffix: true });
		return friendlyDate;
	},
	number: (value) => {
		if (value + '' === 'null') return '';
		return Number(value);
	},
	fixed2: (value) => {
		if (value + '' === 'null') return '';
		return parseFloat(Number(value).toFixed(2)).toLocaleString('en-US', {
			useGrouping: true,
			minimumFractionDigits: 2,
		});
	},
	percent: (value) => {
		const _value = Number(value);
		if (_value <= 1) {
			return (_value * 100).toFixed(2) + '%';
		}
		return _value.toFixed(2) + '%';
	},
	stringify: (value) => {
		if (value + '' === 'null') return '';
		if (typeof value === 'object') return JSON.stringify(value, null, 2);
		if (typeof value === 'number') return value.toString();
		return value;
	},
	forcestring: (value) => {
		return value + '';
	},
	join: (value) => {
		if (!Array.isArray(value)) return value;
		return value.join('');
	},
	mapnumber: (value) => {
		if (!Array.isArray(value)) return value;
		return value.map((x) => Number(x));
	},
	object: (value) => {
		if (_.isNil(value)) return value;
		if (value + '' === 'undefined') return value;

		return JSON.parse(value);
	},
	numbershort: (value) => {
		const _amount = Number(value);
		if (Number.isNaN(_amount)) return value;

		const numberShortened = Intl.NumberFormat('en-US', {
			notation: 'compact',
			maximumFractionDigits: 1,
		}).format(_amount);

		return numberShortened;
	},
	moneyshort: (value) => {
		const numberShortened = StringFormatters.numbershort(value);
		return `$${numberShortened}`;
	},
	encodeuricomponent: (value) => {
		const encoded = encodeURIComponent(value);
		return encoded;
	},
};

export const ApplyStringFormatters = (
	value,
	formatter = '',
	{ debug = false } = {},
) => {
	if (!formatter || ['null', 'undefined'].includes(formatter + '')) {
		return value;
	}

	const [f, ...rest] = formatter.split('[');
	const _formatter = f.trim().toLowerCase();
	let _formatString = rest.join('[').trim() || undefined;
	_formatString =
		typeof _formatString === 'string'
			? _formatString.replace(']', '')
			: undefined;

	if (_formatter in StringFormatters) {
		try {
			return StringFormatters[_formatter](value, _formatString);
		} catch (error) {
			debug &&
				console.log({
					_: 'StringFormatters',
					availableFormatters: Object.keys(StringFormatters),
					error,
					formatter,
					value,
				});
		}
	}
	return value;
};
