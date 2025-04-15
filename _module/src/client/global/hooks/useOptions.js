import { useCallback, useEffect } from 'react';
import { getFormSelectOptions } from '../services';
import { StateManager } from '../../state/state';

export const useOptions = ({ targetQuery, skipQuery }) => {
	const [options = [], setOptions] = StateManager.useListener(targetQuery);

	const updateOptions = useCallback(
		async ({ targetQuery, remove }) => {
			if (remove) {
				setOptions(undefined);
				return true;
			}
			const response = await getFormSelectOptions(targetQuery);
			const optionsList = response.ContextProc[0]?.results;
			setOptions(optionsList);
		},
		[setOptions],
	);

	useEffect(() => {
		if (!targetQuery || skipQuery) return;
		updateOptions({ targetQuery });
		return () => updateOptions({ remove: true });
	}, [targetQuery, skipQuery, updateOptions]);

	return options;
};
