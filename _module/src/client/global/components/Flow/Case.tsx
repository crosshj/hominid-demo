import _ from 'lodash';
import { useEffect, useState } from 'react';

import { clone } from '../../utils';
import { StateManager } from '../../../state/state';
import { whenRunner } from '../../utils/whenConditions';

import { Confirm } from './Confirm';
import { Insert } from './Insert';
import { LocalData } from './LocalData';
import { Navigate } from './Navigate';
import { SetData } from './SetData';
import { Refresh } from './Refresh';
import { BreakFlow } from './BreakFlow.js';
import { Query } from './Query';
import { Trigger } from './Trigger';
import { Validate } from './Validate';

const CaseSupportedComponents = {
	Confirm,
	Insert,
	LocalData,
	Navigate,
	Refresh,
	SetData,
	BreakFlow,
	Query,
	Validate,
	TriggerFlow: Trigger,
} as any;

interface IDataSource {
	flowArgs: Record<string, any>;
	global: Record<string, any>;
}

const isWhenEqual = (
	whenProp: string,
	dataSources: IDataSource,
	debug: string | undefined,
): boolean => {
	if (!whenProp || typeof whenProp !== 'string') return false;

	let _whenProp = 'WHEN ' + whenProp;

	if (debug) _whenProp = 'DEBUG ' + _whenProp;

	const result = whenRunner(_whenProp, dataSources);
	return Boolean(result);
};
export const Case = (props: any) => {
	const { when, flowArgs, onStep, children, debug, onExit } = props;

	const [internalStep, setInternalStep] = useState(0);

	const dataSources = {
		flowArgs,
		global: clone(StateManager.get()),
	};

	const shouldRenderChild = isWhenEqual(when, dataSources, debug);

	const onInternalStep = (newFlowArgs: Record<string, any>) => {
		Object.assign(flowArgs, newFlowArgs);

		setInternalStep((p) => p + 1);
	};

	if (debug) {
		console.log({
			_: 'Case: debug',
			when,
			flowArgs,
			children,
			dataSources,
			shouldRenderChild,
		});
	}

	if (!shouldRenderChild) {
		onStep();
		return null;
	}

	const isLastStep = internalStep >= children.length;
	if (isLastStep) {
		onStep();
		setTimeout(() => setInternalStep(0), 500);
		return null;
	}

	const child = children[internalStep] || {};

	const isChildrenSupported = child?.type in CaseSupportedComponents;

	if (!isChildrenSupported) {
		console.log(
			`CASE: skipping to next child due to unknown component: ${child.type}`,
		);
		setInternalStep((p) => p + 1);
		return null;
	}

	debug &&
		console.log(
			`CASE:debug - step ${internalStep} - rendering: ${child.type}`,
		);

	const ChildComponent = CaseSupportedComponents[child.type];

	const childChildren = Array.isArray(child.children) ? child.children : [];

	return (
		<ChildComponent
			{...child.props}
			children={childChildren}
			flowArgs={flowArgs}
			onStep={onInternalStep}
			onExit={onExit}
		/>
	);
};
