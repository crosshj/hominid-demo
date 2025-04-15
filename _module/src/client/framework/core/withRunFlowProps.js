import { runFlow } from '../../global/components/_MUI/core/runFlow';
import _ from 'lodash';

const getRunnerConfig = ({ propName, propsEntries, propsIntact }) => {
	const runnerConfig = {};
	for (const [key, value] of propsEntries) {
		if (!key.startsWith(propName + ':')) continue;
		const path = key.replace(propName + ':', '');
		_.set(runnerConfig, path, value);
	}
	const applyDebounceDefaults =
		typeof runnerConfig?.throttle === 'undefined' &&
		typeof runnerConfig?.debounce === 'undefined' &&
		propsIntact?.type === 'TextField' &&
		propsIntact?.select === 'undefined';
	if (applyDebounceDefaults) {
		runnerConfig.debounce = {
			wait: 1000,
		};
	}
	if (propsIntact?.debug) {
		console.log({
			_: 'framework/core/withRunFlowProps.js',
			runnerConfig,
		});
	}
	return runnerConfig;
};

const getRunner = (args) => {
	const { thisEntry, propsIntact, propsFilled, propsEntries } = args;
	const [propName, propValue] = thisEntry;
	const { debug } = propsIntact;

	const runnerConfig = getRunnerConfig({
		propName,
		propsEntries,
		propsIntact,
	});

	const flowRunner = (flowArgs) => {
		runFlow(
			{
				propsIntact,
				propsFilled: {
					...propsFilled,
					href: 'flow:' + propValue.replace('runFlow_', ''),
				},
			},
			{ flowArgs },
		);
	};
	if (runnerConfig?.debounce?.wait) {
		const { wait, ...opts } = runnerConfig.debounce;
		return _.debounce(flowRunner, wait, opts);
	}
	if (runnerConfig?.throttle?.wait) {
		const { wait, ...opts } = runnerConfig.throttle;
		return _.throttle(flowRunner, wait, opts);
	}
	return flowRunner;
};

/**
 * @param {{ propsIntact: Record<string, any>, propsFilled?: Record<string, any>}} param0
 * @returns {Record<string, (args: any) => void>}
 */
export const withRunFlowProps = ({
	propsIntact = {},
	propsFilled = {},
} = {}) => {
	const propsWithRunFlow = {};
	const propsEntries = Object.entries(propsIntact);
	for (const thisEntry of propsEntries) {
		try {
			const [propName, propValue] = thisEntry;
			if (
				typeof propValue !== 'string' ||
				!propValue.startsWith('runFlow_')
			) {
				continue;
			}
			propsWithRunFlow[propName] = getRunner({
				thisEntry,
				propsIntact,
				propsFilled,
				propsEntries,
			});
		} catch (error) {
			if (!propsIntact?.debug) continue;
			console.log({
				_: 'framework/core/withRunFlowProps.js',
				prop: Object.fromEntries([thisEntry]),
				error,
			});
		}
	}
	return propsWithRunFlow;
};
