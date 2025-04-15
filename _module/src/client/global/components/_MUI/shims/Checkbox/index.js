import _ from 'lodash';
import { getUseDataProp } from '../useDataUtils';
import { StateManager } from '../../../../../state/state';
import { runFlow } from '../../core/runFlow';

const getNewArrayValues = (currentValue, index) => {
	let newValues = currentValue;

	const alreadyIncludes = currentValue.some((x) => String(x) === index);

	if (alreadyIncludes) {
		newValues = currentValue.filter((x) => String(x) !== index);
	} else {
		newValues = [...currentValue, index];
	}

	newValues.sort((a, b) => a - b);

	return newValues;
};

const getIndex = (propsFilled, propsIntact) => {
	let index = propsFilled.index;

	const checkedIntact = _.get(propsIntact, 'checked', '');
	if (_.isUndefined(index) && checkedIntact.includes('static_')) {
		index = propsIntact.index;
	}

	return String(index);
};

const mountFlowArgs = (newValue, index, propsIntact) => {
	const { __rowIndex, __rowStateKey } = propsIntact;

	const args = {
		index,
		newValue,
	};

	const thereIsRowInfo =
		!_.isUndefined(__rowIndex) && !_.isUndefined(__rowStateKey);

	if (thereIsRowInfo) {
		const rowPath = `${__rowStateKey}[${__rowIndex}]`;

		Object.assign(args, {
			rowIndex: __rowIndex,
			...StateManager.get(rowPath, false, {}),
		});
	}

	return args;
};

const tryToParseToBool = (v) => {
	if (_.isBoolean(v)) return v;
	if (v === 'true') return true;
	if (v === 'false') return false;

	return v;
};

export const Checkbox = ({ propsFilled, propsIntact }) => {
	const propsShimmed = {};

	const useDataProp = getUseDataProp(propsIntact);

	const checkedFilled = tryToParseToBool(propsFilled.checked);

	if (_.isBoolean(checkedFilled)) {
		propsShimmed.checked = checkedFilled;
	}
	if (_.isUndefined(checkedFilled) && useDataProp) {
		propsShimmed.checked = StateManager.get(
			useDataProp,
			propsIntact.debug,
			false,
		);
	}

	propsShimmed.onClick = (e) => {
		let currentValue;

		const isArrayCheckbox = propsIntact.index !== undefined;

		if (useDataProp) {
			const defaultValue = isArrayCheckbox ? [] : false;

			currentValue = StateManager.get(
				useDataProp,
				propsIntact.debug,
				defaultValue,
			);
		}

		// ? if is using checked="global_something"
		// ? most probably is a switch or single checkbox, since in tables using "index" prop is required
		if (
			_.isString(propsIntact.checked) &&
			propsIntact.checked.startsWith('global_')
		) {
			const _path = propsIntact.checked.replace('global_', '');

			currentValue = StateManager.get(_path, false, false);
		}

		let newValue;

		let index;

		if (Array.isArray(currentValue)) {
			index = getIndex(propsFilled, propsIntact);

			if (_.isUndefined(index)) {
				console.error(
					'an index must be provided when Checkbox is used with array Data',
				);
				return;
			}

			newValue = getNewArrayValues(currentValue, index);
		} else {
			newValue = !currentValue;
		}

		runFlow(
			{ propsFilled, propsIntact },
			{ flowArgs: mountFlowArgs(newValue, index, propsIntact) },
		);

		if (useDataProp) {
			StateManager.update(useDataProp, newValue);
		}
	};

	return { propsShimmed };
};
