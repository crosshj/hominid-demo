import _ from 'lodash';

import { StateManager } from '../../../../../state/state';
import { applyInputProps } from '../../../../utils/parseProperties';
import { getUseDataProp } from '../useDataUtils';
import { withRunFlowProps } from '../../../../../framework/core/withRunFlowProps';
import { getOptions } from './optionsHelper';

const buildChildren = (options: any[]) => {
	const noneSelected = {
		value: -99999,
		label: '',
	};

	return [noneSelected].concat(options).map((option) => {
		return (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		);
	});
};

const getDefaultValue = (
	propsIntact: any,
	propsFilled: any,
	options: any[],
) => {
	if (propsFilled.defaultValue) return propsFilled.defaultValue;

	const specialDefaultValues = {
		first: options[0]?.value,
		second: options[1]?.value,
	} as any;

	const { defaultValue } = propsIntact;

	return specialDefaultValues[defaultValue] || null;
};

export const Select = ({ propsIntact, propsFilled }: any) => {
	const useDataProp = getUseDataProp(propsIntact);
	let { SelectProps = {} } = propsIntact;

	const options = getOptions(propsIntact, propsFilled);
	const childrenShimmed = buildChildren(options);

	const runFlowProps = withRunFlowProps({
		propsIntact,
		propsFilled,
	}) as Record<string, (props: any) => void>;

	const propsShimmed = {
		fullWidth: ['true', '1', 'fullWidth'].includes(
			_.get(propsIntact, 'fullWidth', true) + '',
		),
		select: true,
		SelectProps: {
			native: true,
			...SelectProps,
		},
		value: propsFilled.value,
		onChange: (_e: any) => {},
		onBlur: (_e: any) => {},
	};

	applyInputProps(propsIntact, propsShimmed);

	propsShimmed.onChange = (e) => {
		let newValue = Number.isNaN(Number(e.target.value))
			? e.target.value
			: Number(e.target.value);
		newValue = propsIntact.coerce === false ? e.target.value : newValue;

		if (newValue === -99999) {
			newValue = null;
		}
		StateManager.update(useDataProp, newValue);
		if (typeof runFlowProps?.onChange === 'function') {
			runFlowProps.onChange({
				name: propsIntact.name,
				props: propsIntact,
				option: options.find((x) => x.value === newValue),
				newValue,
			});
		}
	};

	propsShimmed.onBlur = (e) => {
		if (typeof runFlowProps?.onBlur === 'function') {
			runFlowProps.onBlur({
				name: propsIntact.name,
				option: {},
				props: propsIntact,
			});
		}
	};

	const valueIsNil = ['null', 'undefined'].includes(propsShimmed.value + '');
	const isUsingDefaultValue = typeof propsIntact.defaultValue !== 'undefined';

	if (valueIsNil && isUsingDefaultValue) {
		const defaultVal = getDefaultValue(propsIntact, propsFilled, options);
		propsShimmed.value = defaultVal;
		StateManager.update(useDataProp, defaultVal);
	}

	return { propsShimmed, childrenShimmed };
};
