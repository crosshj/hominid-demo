import _ from 'lodash';
import { useEffect } from 'react';
import { StateManager } from '../../../state/state';

const handler = (originalArgs) => () => {
	const { source, defaultValue, name } = originalArgs;
	const sourceValue = StateManager.get(source);
	if (defaultValue === 'no_default') return;
	if (!Array.isArray(sourceValue)) return;
	const valueFromSource = (
		(defaultValue === 'last'
			? sourceValue[sourceValue.length - 1]
			: sourceValue[0]) || {}
	).value;
	if (typeof valueFromSource === 'undefined') return;
	StateManager.update(name, valueFromSource);
};

/*
	when a useParams is called, there may have already been updates to state it depends on
	if so, it may not get updates which trigger a call to DB
	there are at least two approaches to handling this:

	1) any time any update happens, check if the previous value is the same as what is known locally
		- caveat: this assumes some update will happen after the subscribe (what if not?)
	2) when a subscribe happens, call the handler with current value in global state if it exists
		- caveat: what if the job of the handler has already been done elsewhere (needlessly redundant)

	shouldUpdate is in line with #1, but we may use #2 going forward
*/
const shouldUpdate = (source) => {
	let prevValue;
	return ({ next }) => {
		const newValue = _.get(next, source);
		const isEqual = _.isEqual(
			JSON.stringify(prevValue),
			JSON.stringify(newValue),
		);
		if (isEqual) return false;
		prevValue = newValue;
		return true;
	};
};

export const useSource = (args, depends = []) => {
	useEffect(() => {
		const { source: sourceSrc, debug } = args;
		if (typeof sourceSrc !== 'string') return;
		const source = sourceSrc.replace('global_', '');
		const subCfg = {};
		if (debug) subCfg.debug = true;
		return StateManager.subscribe(
			shouldUpdate(source),
			handler({ ...args, source }),
			{
				note: `useSource[${source}]:${args.name}`,
				...subCfg,
			},
		);
	}, depends);
};
