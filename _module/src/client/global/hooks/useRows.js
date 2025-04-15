import { nestData } from '../utils';
import { StateManager } from '../../state/state';

export const useRows = ({ nesting, source }) => {
	let [data] = StateManager.useListener(source);
	const isLoading = typeof data === 'undefined';
	data = Array.isArray(data) ? data : [];

	const dataWithIndex = data.map((d, i) => ({
		...d,
		__index: i,
		__rowStateKey: source,
	}));

	const rows = nestData({
		params: nesting.params,
		names: nesting.names,
		data: dataWithIndex,
	});
	// TODO: use this pattern soon
	// const rows =
	// 	formValues?.values?.length > 0
	// 		? formValues?.values
	// 		: nestData(nesting.params, state[source], nesting.names);

	return { rows, isLoading };
};
