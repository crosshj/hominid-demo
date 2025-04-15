import _ from 'lodash';
import { StateManager } from '../../../../../state/state';
import { getUseDataProp } from '../useDataUtils';

const getValue = (propsFilled, propsIntact) => {
	let value;

	if (!_.isUndefined(propsFilled.value)) {
		value = propsFilled.value;
	}

	if (_.isUndefined(value) && !_.isUndefined(propsIntact.value)) {
		value = propsIntact.value;
	}

	if (_.isUndefined(value)) {
		console.warn('Radio got undefined value', { propsIntact });
	}

	return value;
};

export const Radio = ({ propsFilled, propsIntact }) => {
	const useDataProp = getUseDataProp(propsIntact);
	const value = getValue(propsFilled, propsIntact);

	const propsShimmed = {
		checked: String(StateManager.get(useDataProp)) === String(value),
	};

	propsShimmed.onClick = (e) => {
		StateManager.update(useDataProp, value);
	};

	return { propsShimmed };
};
