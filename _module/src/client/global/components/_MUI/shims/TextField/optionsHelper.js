import { StateManager } from '../../../../../state/state';

export const getOptions = (propsIntact, propsFilled) => {
	const { options: optionsFilled } = propsFilled;
	const { options: optionsIntact } = propsIntact;

	// ? "optionsFilled" is an array, i.e everything is correct
	if (Array.isArray(optionsFilled)) return optionsFilled;

	// ? "optionsFilled" is NOT an array but still has value, i.e something is very wrong with either the State or DB
	if (typeof optionsFilled !== 'undefined') return [];

	// ? "optionsFilled" is undefined, so it is possible that "optionsIntact" is a path to a global state, but it does not have global_ prefix
	const isPathToGlobalState = StateManager.isPropertyDefined(optionsIntact);
	if (!isPathToGlobalState) return [];

	// ? at this point "optionsIntact" is indeed a state value, let's get it and ensure it is an array
	const maybeOptionsArray = StateManager.get(optionsIntact);

	if (Array.isArray(maybeOptionsArray)) return maybeOptionsArray;

	// ? safe case
	return [];
};
