import _ from 'lodash';
import { format } from 'date-fns';

import { StateManager } from '../../../../../state/state';
import {
	applyInputProps,
	ApplyStringFormatters,
} from '../../../../utils/parseProperties';
import { handleDateKeywords } from '../../../../utils/dateKeywords';
import { getUseDataProp } from '../useDataUtils';
import { DateTime } from '../../../../../global/utils/parseDates';
import { withRunFlowProps } from '../../../../../framework/core/withRunFlowProps';
import obscureData from '../../../../utils/obscureData';

export const DateHandler = {
	shouldIgnoreTimezone: (inputType) => {
		const inputsThatIgnoreTZ = ['datetime-local'];
		return inputsThatIgnoreTZ.includes(inputType);
	},
	shouldConvert: (inputType) => {
		const inputsThatUseDateTimeConverter = ['date', 'month'];
		return inputsThatUseDateTimeConverter.includes(inputType);
	},
	formatterByTypeMap: {
		'datetime-local': (v) => format(new Date(v), "yyyy-MM-dd'T'HH:mm"),
		date: (v) => format(new Date(v), 'yyyy-MM-dd'),
		month: (v) => format(new Date(v), 'yyyy-MM'),
		week: (v) => format(new Date(v), "yyyy-'W'I"),
		time: (v) => '00:00',
	},
	inputDefaults: ['datetime-local', 'date', 'month', 'week', 'time'],
	convert: (inputType, value) => {
		if (typeof value !== 'string') return value;

		try {
			const valueInLocalTz = DateTime.toLocal(value);

			const dateFormatter = DateHandler.formatterByTypeMap[inputType];

			return dateFormatter(valueInLocalTz);
		} catch (error) {
			console.log('Error when converting date format', {
				value,
				inputType,
				error,
			});
		}

		return '';
	},
};

export const getAndFormatInputValue = ({
	useDataProp,
	propsFilled,
	inputType,
	formatter,
	debug,
}) => {
	let value;

	if (_.isString(useDataProp) && !_.isEmpty(useDataProp)) {
		value = StateManager.get(useDataProp);
	}
	if (_.isUndefined(value) && !_.isUndefined(propsFilled.value)) {
		value = propsFilled.value;
	}
	if (DateHandler.shouldConvert(inputType)) {
		value = DateHandler.convert(inputType, value);
	}
	if (DateHandler.shouldIgnoreTimezone(inputType)) {
		const utcISODateMatcher =
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,})?Z$/;
		const isUTCIsoDate = utcISODateMatcher.test(value);

		value = isUTCIsoDate ? value.slice(0, 16) : value;
	}

	// ? MUI TextField only accept STRING. On the 3 "if" statements below we ensure that.
	if (_.isObject(value)) {
		value = JSON.stringify(value, null, 2);
	}
	if (_.isNil(value)) {
		value = '';
	}

	value = ApplyStringFormatters(value, formatter, { debug });
	return value;
};

export const coerceInputEventValue = (val, { coerce, debug }) => {
	const coerceIsOff = !['true', 'coerce'].includes(coerce + '');
	const valueCanNotBeCoerced = typeof val !== 'string';

	if (coerceIsOff || valueCanNotBeCoerced) return val;

	if (val === '') return null;
	if (Number.isNaN(Number(val)) || val.endsWith(' ') || val.startsWith(' ')) {
		return val;
	}

	return Number(val);
};

const eitherFilledIntactOrDefault = (
	propName,
	{ propsIntact, propsFilled, defaultValue },
) => {
	if (typeof propsFilled[propName] !== 'undefined') {
		return propsFilled[propName];
	}
	if (typeof propsIntact[propName] !== 'undefined') {
		return propsIntact[propName];
	}

	return defaultValue;
};

export const Input = ({ propsIntact, propsFilled, ...rest }) => {
	const useDataPropWithFormatter = getUseDataProp(propsIntact);
	const [useDataProp, formatter] = (useDataPropWithFormatter || '').split(
		':',
	);
	const inputType = _.get(propsIntact, '_src.type', '');

	const runFlowProps = withRunFlowProps({ propsIntact, propsFilled });

	if (propsIntact.debug) {
		console.log({
			_: 'TextField Debug',
			propsIntact,
			propsFilled,
			...rest,
		});
	}
	const value = getAndFormatInputValue({
		useDataProp,
		propsFilled,
		formatter,
		inputType,
		debug: propsIntact.debug,
	});

	const propsShimmed = {
		fullWidth: eitherFilledIntactOrDefault('fullWidth', {
			propsIntact,
			propsFilled,
			defaultValue: true,
		}),
		multiline: eitherFilledIntactOrDefault('multiline', {
			propsIntact,
			propsFilled,
			defaultValue: false,
		}),
		disabled: eitherFilledIntactOrDefault('disabled', {
			propsIntact,
			propsFilled,
			defaultValue: false,
		}),
		value: propsIntact.obscured
			? obscureData(value, propsIntact.obscured)
			: value,
	};
	applyInputProps(propsIntact, propsShimmed);

	propsShimmed.onChange = (e) => {
		const newValue = coerceInputEventValue(e.target.value, propsIntact);

		if (_.isUndefined(useDataProp) || _.isEmpty(useDataProp)) {
			console.warn('undefined/empty "useDataProp" on Input:', {
				useDataProp,
				propsFilled,
				propsIntact,
			});
			return;
		}
		const updateValue =
			DateHandler.shouldConvert(inputType) && newValue !== null
				? DateTime.toGlobal(newValue)
				: newValue;
		StateManager.update(useDataProp, updateValue);

		if (typeof runFlowProps?.onChange === 'function') {
			runFlowProps.onChange({
				name: propsIntact.name,
				props: propsIntact,
			});
		}
	};

	propsShimmed.onBlur = (e) => {
		if (typeof runFlowProps?.onBlur === 'function') {
			runFlowProps.onBlur({
				name: propsIntact.name,
				props: propsIntact,
			});
		}
	};

	propsShimmed.onKeyDown = (e) => {
		if (typeof runFlowProps?.onEnter === 'function' && e?.key === 'Enter') {
			runFlowProps.onEnter({
				name: propsIntact.name,
				props: propsIntact,
			});
		}
	};

	propsShimmed.InputLabelProps = propsShimmed.InputLabelProps || {};

	// ? If is date type that accepts default values
	// ? AND defaultValue property is present
	// ? AND "useData" prop is defined on state, i.e value comes from state
	// ? AND value is an empty string/undefined/null
	if (
		DateHandler.inputDefaults.includes(inputType) &&
		propsIntact.defaultValue &&
		StateManager.isPropertyDefined(useDataProp.split('.')[0]) &&
		(_.isEmpty(value) || _.isNil(value))
	) {
		const _value = handleDateKeywords(propsIntact.defaultValue);
		const _valueFormatted = DateHandler.convert(inputType, _value);

		propsShimmed.value = _valueFormatted;
		StateManager.update(useDataProp, _valueFormatted);
	}
	if (
		typeof propsShimmed.InputLabelProps.shrink === 'undefined' &&
		DateHandler.inputDefaults.includes(inputType)
	) {
		propsShimmed.InputLabelProps.shrink = true;
	}
	if (
		propsIntact.disabled &&
		DateHandler.inputDefaults.includes(inputType) &&
		!propsShimmed.value
	) {
		propsShimmed.type = 'text';
	}

	// because error -> MUI: Too many re-renders. The layout is unstable.
	// this is supposed to be fixed, but it doesn't look that way
	// https://github.com/mui/material-ui/issues/33081
	// if (propsIntact.multiline) {
	// 	propsShimmed.InputProps =
	// 		propsFilled.InputProps || propsIntact.InputProps || {};
	// 	propsShimmed.InputProps.native = true;
	// }

	return { propsShimmed };
};
