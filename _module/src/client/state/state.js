import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useSyncExternalStore } from 'react';
import { clone } from '../global/utils/clone';
import { matchIndex } from '../global/utils/parseProperties';

let state = {};
let subscriptions = [];

const debug = {};

const setWindow = (args) => {
	if (typeof window === 'undefined') return;
	window.currentState = args.state;
	window.currentSubs = args.subscriptions;
	window.currentDebug = args.debug;
};
setWindow({ state, subscriptions, debug });

const ignorePrefix = (v) => (v?.replace ? v.replace(/^global_/, '') : v);

const get = (path, debug, defaultValue) => {
	const returnState =
		typeof path === 'function' ||
		typeof path === 'undefined' ||
		path === '';
	let value = returnState ? state : _.get(state, ignorePrefix(path));
	if (typeof value === 'undefined' && typeof defaultValue !== 'undefined') {
		value = defaultValue;
	}
	debug && console.log('State.get: ', { path, state: clone(state), value });
	return value;
};

const init = (initialState = {}) => {
	state = initialState;
	subscriptions = [];
	setWindow({ state, subscriptions, debug });
	// console.log('State Manager Init');
	// console.log({ state, subscriptions });
};

const subscribe = (path, handler, cfg = {}) => {
	const _id = uuidv4();
	if (cfg?.debug && typeof path === 'string') {
		debug[path] = true;
	}
	if (cfg.unique) {
		const isAlreadySubscribed = subscriptions.some(
			(x) => x.path === path && x.ogHandler === handler,
		);

		if (isAlreadySubscribed) return;
	}
	// DEBUG should be tied to active subscription (added here)
	const DEBUG = (() => {
		// return console.log
		if (typeof path !== 'string') return () => {};
		if (debug[path] !== true) return () => {};
		return (...x) => console.log(`[${path}]`, ...x);
	})();

	const subConfig = {
		_id,
		path,
		ogHandler: handler,
		handler: (...args) => {
			DEBUG('HANDLE: ', { path, cfg, value: args[0] });
			handler(...args);
		},
		...cfg,
	};
	subscriptions.push(subConfig);
	setWindow({ state, subscriptions, debug });
	// DEBUG('+++SUB: ', { subConfig, subscriptions, state });
	return () => {
		// DEBUG should be tied to active subscription (remove here)
		// DEBUG('---SUB: ', {
		// 	subConfig,
		// 	subscriptions,
		// 	state,
		// });
		subscriptions = subscriptions.filter((x) => x._id !== subConfig._id);
		setWindow({ state, subscriptions, debug });
	};
};

const notify = ({ path, value, prev, message }) => {
	const DEBUG = (() => {
		// return console.log
		if (typeof path !== 'string') return () => {};
		if (debug[path] !== true) return () => {};
		const pathRoot = path.split('.').shift();
		return (...x) => console.log(`[${pathRoot}]`, ...x);
	})();

	if (typeof message !== 'undefined') {
		const messageListeners = subscriptions.filter((sub) => {
			return sub?.path === message;
		});
		for (const messageRecipient of messageListeners) {
			messageRecipient.handler({ message });
		}
		return;
	}

	DEBUG('UPDATE: ', {
		v: state.version,
		p: path,
		va: value,
		old: _.get(prev, path),
		new: _.get(state, path),
		state,
		prev,
	});

	//console.log({ state, path, value, subscriptions });
	const listening = subscriptions.filter((sub) => {
		// also, has the thing changed significantly at this level?
		// maybe more importantly, did the sub say it wanted to listen like this?
		// console.log({ path, subPath: sub.path });
		/*
		if (!sub.path) return true;
		if (!path) {
			return Object.keys(value).includes(sub.path);
		}
		return path === sub.path;
		*/
		return true;
		//return path.startsWith(sub.path);
	});
	const noted = subscriptions.filter((x) => x.note);

	DEBUG('**SUBS: ', {
		all: subscriptions,
		path,
		value,
		noted,
		listening,
	});
	const triggers = [];
	for (const listener of listening) {
		if (typeof listener.path === 'function') {
			const shouldTrigger = listener.path({
				prev,
				next: state,
				path,
				value,
			});
			//if (shouldTrigger) listener.handler(state);
			if (shouldTrigger) {
				//console.log({ path, value, prev, message });
				triggers.push({
					listener,
					value: _.get(state, path),
					prevValue: _.get(prev, path),
					path,
				});
				//triggers.push({ listener, value: state });
			}
			continue;
		}
		if (typeof listener.path === 'undefined') {
			//triggers.push([listener.handler, state, '---']);
			triggers.push({ listener, value: state });
			//listener.handler(state);
			continue;
		}
		const prevValue = _.get(prev, listener.path); //what if listener has a previous version that is different?
		const newValue = _.get(state, listener.path);
		const isEqual = _.isEqual(
			JSON.stringify(prevValue),
			JSON.stringify(newValue),
			// prevValue,
			// newValue
		);
		if (isEqual) continue;
		triggers.push({ listener, value: newValue, prevValue, path });
	}

	for (const { listener, value, prevValue, path } of triggers) {
		//DEBUG('TRIGGR: ', { listener, value });
		const index = matchIndex(path);

		listener.handler(value, prevValue, path, index);
		//listener.value = value;
	}
};

const update = (path, value) => {
	const prevState = clone(state);
	if (path && typeof path !== 'function') {
		_.set(state, ignorePrefix(path), value);
	} else {
		//value.loading && console.log({ value });
		// TODO: should never do this
		// this is especially problematic because we don't know when to update listeners below
		//state = { ...state, ...coercedValue };
	}
	state.version += 1;
	notify({ path: ignorePrefix(path), value, prev: prevState });
	//if (typeof state.pathData !== 'undefined') debugger;
};

const refresh = (path) => {
	const currentValue = clone(get(path));
	update(path, undefined);
	update(path, currentValue);
};

const _useListener = (path, defaultValue, cfg) => {
	const pathDefined = typeof path !== 'undefined';
	const defaultDefined = typeof defaultValue !== 'undefined';
	let currentValue;
	if (pathDefined) {
		currentValue = get(path);
	}
	if (defaultDefined && typeof currentValue === 'undefined') {
		update(path, defaultValue);
	}

	const doSubscribe = (callback) => {
		return subscribe(path, callback, cfg);
	};
	const getSnapshot = () => {
		return get(path);
	};
	const value = {
		get useValue() {
			if (typeof useSyncExternalStore === 'undefined') {
				console.error(`State Manager not bound to React!`);
				return;
			}
			const value = useSyncExternalStore(doSubscribe, getSnapshot);
			return value;
		},
		update: (v) => update(path, v),
	};

	return [value.useValue, value.update];
};

const useListener = (path, defaultValue, cfg) => {
	if (Array.isArray(path)) {
		const values = {};
		for (const pathItem of _.uniq(path)) {
			values[pathItem] = _useListener(pathItem, defaultValue, cfg);
		}
		return values;
	}
	return _useListener(path, defaultValue, cfg);
};

export const StateManager = {
	init,
	get,
	isPropertyDefined: (key) => key in state,
	update,
	refresh,
	notify,
	subscribe,
	useListener,
};
