import _ from 'lodash';
import { StateManager } from '../../../../state/state';

export const getUseDataProp = ({ value, useData = '', ...rest }) => {
	const { __rowStateKey, __rowIndex } = rest;

	if (_.isString(value) && value.includes('global_')) {
		return value.replace(/global_/gm, '').replace(/row_index/g, __rowIndex);
	}

	if (_.isString(value) && value.startsWith('row_')) {
		const path = value.replace('row_', '');

		return `${__rowStateKey}[${__rowIndex}].${path}`;
	}

	if (useData.includes('row_index')) {
		return useData
			.replace(/row_index/g, __rowIndex)
			.replace(/global_/gm, '');
	}

	if (useData) {
		return useData;
	}

	return undefined;
};

export const maybeUseData = ({ propsIntact }) => {
	const { __rowIndex, __rowStateKey } = propsIntact;
	if ([__rowStateKey + '', __rowIndex + ''].includes('undefined')) return;

	const useDataProp = getUseDataProp(propsIntact);

	const maybeRowPath = `${__rowStateKey}[${__rowIndex}]`;
	const maybeRowValue = StateManager.get(maybeRowPath, false, {});
	// DEPRECATE: in favor of flowArgs
	if (useDataProp && !_.isEmpty(maybeRowValue)) {
		StateManager.update(useDataProp, maybeRowValue);
	}
};
