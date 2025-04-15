import { useEffect, useMemo } from 'react';
import { clone } from '../../utils';
import { StateManager } from '../../../state/state';
import { getFilledQueryParams } from '../../utils/getFilledQueryParams';
import { submitFormData } from '../../services';

const workflowEnd = (process: any) => {
	try {
		process.pollInterval && clearInterval(process.pollInterval as any);
	} catch (e) {}
};
const workflowPoll = async (process: any) => {
	const input = {
		name: 'ui.sp_Upsert',
		args: JSON.stringify({
			key: 'process.sp_WorkflowStateGetTreeByProcessNameControlID',
			processName: process?.params?.processName,
			controlId: process?.workflow?.controlId,
		}),
	};
	const results = await submitFormData([input]);
	try {
		if (!results?.[0]) {
			throw new Error(
				`Could not find process: ${process.processName || 'unknown'}`,
			);
		}
		if (results[0]?.error) throw new Error(results[0].error);
		const { CompletedStatus, Extended_JSON } =
			JSON.parse(results?.[0]?.results)?.[0] || {};
		process.status = CompletedStatus;
		if (['Completed', 'Abandoned'].includes(CompletedStatus + '')) {
			process.results = JSON.parse(Extended_JSON || 'false') || undefined;
			workflowEnd(process);
		}
	} catch (e) {
		process.error = e.message;
		workflowEnd(process);
	}
	const { pollInterval, ...processRest } = process;
	StateManager.update(`process.${process.name}`, clone(processRest));
};
const workflowStart = async (process: any) => {
	StateManager.update(`process.${process.name}`, process);
	const input = {
		name: 'ui.sp_Upsert',
		call: 'workflowAsyncProcess',
		args: JSON.stringify(process.params),
	};
	const results = await submitFormData([input]);
	try {
		if (results?.[0]?.error) throw new Error(results[0].error);
		process.workflow = JSON.parse(results?.[0]?.results)?.workflow;
	} catch (e) {
		process.error = e.message;
		workflowEnd(process);
	}
	StateManager.update(`process.${process.name}`, clone(process));
	process.pollInterval = setInterval(
		() => workflowPoll(process),
		process.delay || 3000,
	);
};

const WorkflowSubscribe = (props: any) => {
	const process = {
		...(props || {}),
		status: 'loading',
		workflow: [{} as any],
		results: undefined,
		error: undefined,
	};
	workflowStart(process);
	return () => workflowEnd(process);
};

export const AwaitProcess = (props: any) => {
	const { debug, onStep, onExit, flowArgs, delay, name, ...propsRest } =
		props;

	const paramsFilled = useMemo(() => {
		const global = clone(StateManager.get());

		const filled = getFilledQueryParams(
			propsRest,
			{ global, flowArgs },
			{ debug: Boolean(debug) },
		);

		return filled;
	}, [flowArgs, propsRest]);

	if (debug) {
		console.log({
			_: 'AwaitProcess: debug',
			name,
			delay,
			paramsFilled,
			flowArgs,
		});
	}

	useEffect(() => {
		const shouldHandleState = ({ path }: any = {}) => {
			return (path + '').startsWith(`process.${name}`);
		};
		const stateUpdateHandler = (value: any) => {
			if (value?.error) {
				onExit();
				return;
			}
			if (value?.status === 'Completed') {
				onStep();
				return;
			}
		};
		const stateUnSub = StateManager.subscribe(
			shouldHandleState,
			stateUpdateHandler,
			{ note: `process.${name}` },
		);
		const workflowUnsub = WorkflowSubscribe({ name, params: paramsFilled });
		const unsub = () => {
			workflowUnsub && workflowUnsub();
			stateUnSub && stateUnSub();
		};
		return unsub;
	}, [name, paramsFilled]);

	return null;
};
