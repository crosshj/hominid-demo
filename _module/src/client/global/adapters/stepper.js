import { StateManager } from '../../state/state';
import { Stepper } from '../components/Stepper';
import { useEffect } from 'react';

const StepperAdapter = ({ type, children, props }) => {
	const steps = children.filter((child) => child.type === 'Step');
	const [, setState] = StateManager.useListener(undefined, undefined, {
		note: 'global/adapters/stepper',
	});
	useEffect(() => {
		setState({ steps });
	}, [children.length, setState, steps]);

	return { Component: Stepper, steps, ...props };
};
export const stepperAdapter = StepperAdapter;
