import { StateManager } from '../../../state/state';

export const Trigger = (props) => {
	const {
		debug,
		delay = 1,
		handler,
		forwardFlowArgs = false,
		flowArgs,
		onStep,
	} = props;

	const flowQueue = StateManager.get('flowQueue', false, []);

	setTimeout(() => {
		const currentFlow = flowQueue[0];

		const newFlow = {
			key: handler,
			args: forwardFlowArgs ? flowArgs : {},
		};

		const hasHandlerAttached =
			handler in StateManager.get('flowHandlersByKey', false, {});

		if (!hasHandlerAttached) {
			debug &&
				console.log(
					'FlowTrigger:debug - not running flow because handler does not match any <Flow /> in this page',
					{
						props,
						handler,
					},
				);

			onStep();
			return null;
		}

		// current flow is the one rendering this component. we need to step that forward
		const currentFlowAdvanced = {
			...currentFlow,
			stepNumber: currentFlow.stepNumber + 1,
		};

		// removing 1st element, which is the current flow.  will be stored again with stepNumber + 1
		const flowQueueRest = flowQueue.slice(1);

		const newQueue = [newFlow, currentFlowAdvanced, ...flowQueueRest];

		if (debug) {
			console.log('FlowTrigger:debug', {
				props,
				currentFlowAdvanced,
				flowQueueRest,
				flowQueue,
				newFlow,
				newQueue,
			});
		}

		StateManager.update('flowQueue', newQueue);
	}, delay);
	return null;
};
