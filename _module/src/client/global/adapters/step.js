import { StateManager } from '../../state/state';
import { Step } from '../components/Step';

export const StepAdapter = ({ props }) => {
	const { params = '' } = props || {};
	const [state] = StateManager.useListener(undefined, undefined, {
		note: 'global/adapters/step',
	});
	const paramsNames = params?.split('&') || [];
	const paramsObj = paramsNames.reduce((a, p) => {
		if (!p) return a;
		return { ...a, [p]: state[p] };
	}, {});

	return { Component: Step, ...props, params: paramsObj };
};

export const stepAdapter = StepAdapter;
