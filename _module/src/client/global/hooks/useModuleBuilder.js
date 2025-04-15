import { useState } from 'react';
import { useApi } from './useApi';
import { StateManager } from '../../state/state';

export const useModuleBuilder = ({
	name,
	graphqlActions = [],
	initialState = {},
}) => {
	const [state, updateState] = useState(initialState);

	const setState = (update) => {
		//console.log('global state has changed');
		if (typeof update === 'function') return updateState(update);
		updateState((prevState) => {
			StateManager.update('', update);
			return { ...prevState, ...update };
		});
	};

	const api =
		useApi({
			queryList: graphqlActions,
			setState,
		}) || {};

	return {
		api,
		state,
		setState,
		name,
	};
};
