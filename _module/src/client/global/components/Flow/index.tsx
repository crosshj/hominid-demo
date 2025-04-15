import { useEffect } from 'react';

import _ from 'lodash';
import { StateManager } from '../../../state/state';

import { Cookie } from './Cookie';
import { Confirm } from './Confirm';
import { Query } from './Query/index.jsx';
import { SetData } from './SetData';
import { LocalData } from './LocalData';
import { Navigate } from './Navigate';
import { Refresh } from './Refresh';
import { Insert } from './Insert';
import { Case } from './Case.jsx';
import { Call } from './Call';
import { FileUpload } from './FileUpload';
import { Validate } from './Validate';
import { BreakFlow } from './BreakFlow.js';
import { Trigger } from './Trigger';

import type {
	FlowQueueListener,
	GenericProps,
	FlowSupportedComponentsMap,
	GenericFlow,
} from './types';
import { AwaitProcess } from './AwaitProcess';

const FlowSupportedComponents: FlowSupportedComponentsMap = {
	BreakFlow,
	Call,
	Confirm,
	Cookie,
	FlowStep: Query,
	Insert,
	LocalData,
	Navigate,
	FileUpload,
	Query,
	Case,
	Refresh,
	SetData,
	Submit: Query,
	TriggerFlow: Trigger,
	Validate,
	AwaitProcess,
};

const getFlowQueue = () => {
	return StateManager.get('flowQueue', false, []) as GenericFlow[];
};

export const flowQueueCleaner = () => {
	const queue = getFlowQueue();
	const flowHandlersByKey = StateManager.get('flowHandlersByKey', false, []);

	const hasFlowsWithoutHandlers = queue.some(
		(x: any) => !(x.key in flowHandlersByKey),
	);

	if (hasFlowsWithoutHandlers) {
		StateManager.update(
			'flowQueue',
			queue.filter((x: any) => x.key in flowHandlersByKey),
		);
	}
};

export const Flow = (flowProps: GenericProps) => {
	const { id: flowKey, children, debug } = flowProps;
	const [globalQueue, setGlobalQueue] = StateManager.useListener(
		'flowQueue',
	) as FlowQueueListener;

	const currentFlow = _.get(globalQueue, '0', {} as GenericFlow);

	useEffect(() => {
		return () => {
			const queue = getFlowQueue();
			setGlobalQueue(queue.filter((x) => x.key !== flowKey));
		};
	}, []);

	// is component the actual current flow?
	const isCurrent = currentFlow.key === flowKey;
	const amountOfComponentsToRender = Array.isArray(children)
		? children.length
		: 0;

	if (!isCurrent || amountOfComponentsToRender === 0) return null;

	const _currentStepNumber = _.isNumber(currentFlow.stepNumber)
		? currentFlow.stepNumber
		: 0;

	const finishFlow = () => {
		const [, ...flowQueueRest] = getFlowQueue();
		setGlobalQueue(flowQueueRest);
	};

	const onStep = (data = {}) => {
		const nextStepNumber = _currentStepNumber + 1;

		if (nextStepNumber === amountOfComponentsToRender) {
			finishFlow();
			return;
		}
		if (nextStepNumber > amountOfComponentsToRender) {
			console.warn({
				_: 'Flow: how can nextStepNumber be greater than amountOfComponentsToRender?',
				nextStepNumber,
				amountOfComponentsToRender,
			});
			finishFlow();
			return;
		}

		const [, ...flowQueueRest] = getFlowQueue();
		const currentFlowModified = {
			...currentFlow,
			stepNumber: nextStepNumber,
			args: {
				...currentFlow.args,
				...data,
			},
		};
		setGlobalQueue([currentFlowModified, ...flowQueueRest]);
	};

	// Trigger steps unaware of flow step count; they sometimes advance past the end
	// just ignore this and go on
	if (_currentStepNumber >= children?.length) {
		finishFlow();
		return null;
	}

	const currentChild = children?.[_currentStepNumber];
	const { type, ...currentChildProps } = currentChild?.props || {};

	if (debug) {
		console.log({
			_: 'Flow:debug',
			flowKey: flowKey,
			flowArgs: currentFlow?.args,
			componentToRender: type,
			stepNumber: _currentStepNumber,
			globalQueue,
			children,
		});
	}

	const childProps = _.get(currentChildProps, 'props', {});
	const childChildren = _.get(currentChildProps, 'children', []);

	const Component =
		FlowSupportedComponents[type as keyof typeof FlowSupportedComponents];

	if (!Component) {
		console.log({
			_: `FLOW: Could not find Flow component`,
			type,
			flowProps,
			currentFlow,
		});
		onStep();
		return null;
	}

	return (
		<Component
			{...(childProps as any)}
			onStep={onStep}
			onExit={finishFlow}
			flowArgs={currentFlow.args}
		>
			{childChildren}
		</Component>
	);
};
