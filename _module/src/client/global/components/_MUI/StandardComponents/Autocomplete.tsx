import { Autocomplete as MUIAutocomplete, TextField } from '@mui/material';
import { StateManager } from '../../../../state/state';
import { withRunFlowProps } from '../../../../framework/core/withRunFlowProps';

const mapProps = (props: any) => {
	const {
		//container props with defaults
		value = '',
		disablePortal = true,
		options = [],

		//ignored / internal use
		_src,
		target,
		children,
		default: defaultSrc,
		parent,
		type,
		variant = 'outlined',

		//input props
		label = 'Autocomplete',
		debug,
		error,
		helperText,

		//open-ended container props
		...other
	} = props;

	let valueMapped = value;
	// when value is a number that options can be indexed on
	if (typeof options?.[value] !== 'undefined') {
		valueMapped = options[value];
	}
	// when value is included as a property of one of the options
	const foundValue =
		options?.find && options.find((x: any) => x.value === value);
	if (foundValue) {
		valueMapped = foundValue;
	}

	let optionsMapped = [];
	if (Array.isArray(options)) {
		optionsMapped = options;
	}

	const srcValue = _src.value || '';
	if (!srcValue.includes('global_')) {
		//console.log('you should be using global_')
	}
	const updatePath = srcValue.replace('global_', '') || '';

	return {
		value: valueMapped || '',
		updatePath,
		options: optionsMapped,
		label,
		variant,
		debug,
		error,
		helperText,
		other: {
			...(other || {}),
			disablePortal,
		},
	};
};

export const Autocomplete = (args: any = {}) => {
	const {
		value: currentValue,
		updatePath,
		options,
		label,
		other,
		variant,
		debug,
		helperText,
		error,
	} = mapProps(args);

	const runFlow = withRunFlowProps({ propsIntact: args });

	const onChange = (_event: any, newValue: any) => {
		if (!updatePath) return;

		const actualNewValue =
			typeof newValue?.value !== 'undefined' && newValue !== null
				? newValue.value
				: newValue;

		if (debug) {
			console.log({
				_: 'Autocomplete:debug',
				eventValue: newValue,
				actualNewValue,
				currentValue,
				updatePath,
			});
		}

		StateManager.update(updatePath, actualNewValue);

		if (typeof runFlow.onChange === 'function') {
			runFlow.onChange({
				name: args.name,
				props: args,
				option: options.find((x) => x.value === actualNewValue),
				newValue: actualNewValue,
			});
		}
	};

	const onBlur = () => {
		if (typeof runFlow.onBlur === 'function') {
			runFlow.onBlur({
				name: args.name,
				option: {},
				props: args,
			});
		}
	};

	return (
		<MUIAutocomplete
			value={currentValue}
			options={options}
			{...other}
			onChange={onChange}
			onBlur={onBlur}
			fullWidth={Boolean(other.fullWidth)}
			disabled={Boolean(other.disabled)}
			renderInput={(params) => (
				<TextField
					{...params}
					required={Boolean(other?.required)}
					error={error}
					helperText={helperText}
					variant={variant}
					label={label}
				/>
			)}
		/>
	);
};
