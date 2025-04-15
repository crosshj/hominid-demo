import _ from 'lodash';
import { StateManager } from '../../../../state/state';
import { format } from 'date-fns';

const pushToQueue = (flowNameSrc, args = {}, debug) => {
	const currentQueue = StateManager.get('flowQueue', false, []);

	const flowNames = parseFlowNames(flowNameSrc);

	const newFlows = flowNames.map((x) => ({ key: x, args }));

	if (debug) {
		console.log({
			_: 'runFlow:debug',
			currentQueue,
			newFlows,
		});
	}
	StateManager.update('flowQueue', [...currentQueue, ...newFlows]);
	return true;
};

const isValidHref = (href = '') => {
	return _.isString(href) && href.includes('flow:');
};

const parseProps = ({ props, flowArgsSrc }) => {
	const { propsFilled = {}, propsIntact = {}, href = '' } = props;
	const { __rowIndex, __rowStateKey, flow, useFlow, debug } = propsIntact;
	const _href = propsFilled.href || propsIntact.href || href;
	const validHref = isValidHref(_href);

	const extraArgs = Object.entries({
		...propsIntact,
		...propsFilled,
	}).reduce((all, [k, v]) => {
		if (!k.startsWith('flowArgs:')) return all;
		if (v === 'event') {
			const now = new Date();
			const datetime = format(now, 'yyyy-MM-dd HH:mm:ss');
			v = {
				startedTime: now.toISOString(),
				time: datetime,
				date: datetime,
			};
		}
		return { ...all, [k.replace('flowArgs:', '')]: v };
	}, {});

	const rowArgs =
		validHref && _.isString(__rowStateKey) && _.isNumber(Number(__rowIndex))
			? StateManager.get(`${__rowStateKey}[${__rowIndex}]`, false, {})
			: undefined;

	const flowArgs = {
		...extraArgs,
		...rowArgs,
		...flowArgsSrc,
		...(_.isUndefined(__rowIndex) ? {} : { index: __rowIndex }),
	};

	const flowName = validHref ? _href.replace(/^flow:/, '') : undefined;

	return { flowArgs, flowName };
};

/**
 * Parses flow names and filters out flows that do not have handlers attached to UIContext.
 * @param {string} flowNameSrc
 * @returns {string[]}
 */
const parseFlowNames = (flowNameSrc) => {
	const flowNames = flowNameSrc
		.split(',')
		.map((x) => x.replace('flow:', '').trim());

	const flowComponentsByKey = StateManager.get('flowHandlersByKey') || {};

	return flowNames.filter((x) => x in flowComponentsByKey);
};

export const runFlow = (props, { flowArgs: flowArgsSrc = {} } = {}) => {
	const { propsFilled = {}, propsIntact = {}, href = '' } = props;
	const { __rowIndex, __rowStateKey, flow, useFlow, debug } = propsIntact;
	const _href = propsFilled.href || propsIntact.href || href;
	const { flowArgs, flowName } = parseProps({ props, flowArgsSrc });

	if (debug) {
		console.log({
			_: 'runFlow:debug',
			__rowIndex,
			__rowStateKey,
			href: _href,
			flowName,
			flow,
			useFlow,
			flowArgsSrc,
			flowArgs,
		});
	}

	// best way to run flows.. href='flow:shouldCallThisFlow'
	if (flowName) {
		return pushToQueue(flowName, flowArgs, debug);
	}

	// deprecated!!
	if (flow) {
		return pushToQueue(flow, flowArgs, debug);
	}

	// deprecated!!
	if (useFlow) {
		return pushToQueue(useFlow, flowArgs, debug);
	}

	return false;
};
