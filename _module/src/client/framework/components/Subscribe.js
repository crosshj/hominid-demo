import _ from 'lodash';
import { StateManager } from '../../state/state';

const buildIndexMatcherRegex = (match = '') => {
	const regexString = match
		.replace(/\[INDEX\]/g, `\\[(\\d+)\\]`)
		.replace(/\./g, `\\.`);
	return new RegExp(regexString);
};

const getSubscribeIndex = (path, { matchProp }) => {
	if (!_.isString(matchProp) || !matchProp.includes('INDEX')) {
		return undefined;
	}

	const regex = buildIndexMatcherRegex(matchProp);
	const matches = path.match(regex);

	if (Array.isArray(matches) && _.isString(matches[1])) {
		return matches[1];
	}
};

// Should trigger if Subscriber.path or Subscriber.match
// actually match the state path that is being updated

export const handleSubscriber = ({
	path: pathProp,
	match: matchProp,
	handler: handlerProp,
	debug,
} = {}) => {
	const _pathProp =
		typeof pathProp === 'string'
			? pathProp.replace('global_', '')
			: pathProp;

	const shouldTrigger = ({ path: updatedPath } = {}) => {
		if (_.isString(_pathProp)) {
			const pathsAreEqual = _pathProp === updatedPath;
			const startsWithPath = (updatedPath + '').startsWith(_pathProp);

			const pathMatches = pathsAreEqual || startsWithPath;

			debug &&
				pathMatches &&
				console.log({
					_: 'Subscribe:debug - calling handler because path matches',
					path: _pathProp,
					handler: handlerProp,
				});

			return pathMatches;
		}

		if (_.isString(matchProp)) {
			const regex = buildIndexMatcherRegex(matchProp);
			const doesMatch = regex.test(updatedPath);

			debug &&
				doesMatch &&
				console.log({
					_: 'Subscribe:debug - MATCH',
					match: matchProp,
					updatedPath: updatedPath,
					handler: handlerProp,
				});

			return doesMatch;
		}

		return false;
	};

	const subHandler = (newValue, oldValue, path, index) => {
		let _index = index;

		if (_.isUndefined(_index)) {
			_index = getSubscribeIndex(path, {
				pathProp: _pathProp,
				matchProp,
			});
		}

		const newFlow = {
			key: handlerProp,
			args: {
				path,
				oldValue,
				newValue,
				index: _index,
				...(_.isObject(newValue) ? newValue : {}),
			},
		};

		const currentQueue = StateManager.get('flowQueue', false, []);

		const flowIsDuplicated = currentQueue.find(
			(flow) =>
				flow.key === handlerProp &&
				JSON.stringify(flow.args) === JSON.stringify(newFlow.args),
		);

		if (debug && flowIsDuplicated) {
			console.log({
				_: 'Subscribe:debug - skipping flow because same flow (key and args) are already on queue',
				currentQueue,
				skippedFlow: newFlow,
			});
			return;
		}

		const newQueue = [...currentQueue, newFlow];

		if (debug) {
			console.log({
				_: 'Subscribe:debug - pushing flow to queue',
				currentQueue,
				newFlow,
				newQueue,
			});
		}

		StateManager.update('flowQueue', newQueue);
	};

	StateManager.subscribe(shouldTrigger, subHandler, {
		note: 'Subscribe.js',
		unique: true,
		_props: {
			matchProp,
			pathProp: _pathProp,
			handlerProp,
		},
	});
};
