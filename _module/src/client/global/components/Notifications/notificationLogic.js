import { StateManager } from '../../../state/state';
import { parseNotifications, getEventTriggers } from './utils.js';

const WATCH_TIMEOUT = 3000;
const current = {
	watchStarted: undefined,
	watch: [],
	seen: [],
};
const resetWatch = () => {
	current.watchStarted = undefined;
	current.watch = [];
	current.seen = [];
};

const getTriggerWatches = (triggers = []) => {
	if (!Array.isArray(triggers)) return [];
	const watches = [];
	for (const trig of triggers) {
		for (const [prop, value] of Object.entries(trig.props)) {
			if (!prop.startsWith('event:')) continue;
			if (!value?.startsWith || !value.startsWith('global_')) continue;
			watches.push(value.replace(/^global_/, ''));
		}
	}
	return watches;
};

export const shouldHandle = (args = {}) => {
	const { path, value } = args;

	if (path === 'UIContext') {
		current.triggers = getEventTriggers(value);
		current.watch = getTriggerWatches(current.triggers);
		if (current.watch.length) {
			current.watchStarted = performance.now();
			return false;
		}
		return true;
	}

	if (current.watchStarted) {
		const diff = performance.now() - current.watchStarted;
		if (diff > WATCH_TIMEOUT) {
			resetWatch();
			return true;
		}
	}

	if (current.watchStarted && current.watch.includes(path)) {
		current.seen.push(path);
		if (current.seen.length !== current.watch.length) return false;
		resetWatch();
		return true;
	}

	if (path === '_internal:notifications') {
		if (!Array.isArray(value?.notifications)) return false;
		return true;
	}

	return false;
};

export const processEvent = () => {
	const { notifications } = StateManager.get('_internal:notifications') || {};
	const UIContext = StateManager.get('UIContext');
	const parsed = parseNotifications(notifications, UIContext);
	return parsed;
};
