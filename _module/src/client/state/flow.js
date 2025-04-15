import { clone } from '../global/utils';
import { StateManager } from './state';

const poll = {
	logLevel: 'error',
	log: (...msg) => console.log(`FlowPollManager: `, ...msg),
	verbose: (...msg) =>
		['verbose'].includes(poll.logLevel) && poll.log(...msg),

	queue: undefined,
	getQueue: () => {
		return clone(poll.queue);
		//return StateManager.get('flowPollQueue', false, []);
	},
	setQueue: (pollQueue) => {
		//StateManager.update('flowPollQueue', pollQueue);
		poll.queue = pollQueue;
		if (poll.queue?.length) {
			poll._startInterval();
		}
		if (!poll.queue?.length) {
			poll._stopInterval();
		}
	},

	interval: undefined,
	_stopInterval: () => {
		if (!poll.interval) return;
		clearInterval(poll.interval);
		poll.interval = undefined;
	},
	_startInterval: () => {
		if (poll.interval) return;
		poll.interval = setInterval(() => {
			const pollQueue = poll.getQueue();
			const NOW = new Date().getTime();
			poll.verbose('processing queue', { pollQueue, NOW });

			for (let i = 0; i < pollQueue.length; i++) {
				const flow = pollQueue[i];

				const isFirstRun = typeof flow.lastRun === 'undefined';
				const shouldRun = isFirstRun || NOW > flow.nextRun;
				if (!shouldRun) {
					poll.verbose('skipping queue item', flow.key);
					continue;
				}
				poll.verbose('running queue item', flow.key, {
					isFirstRun,
					shouldRun,
				});

				poll.pushToFlowQueue(flow);
				pollQueue[i] = {
					...flow,
					lastRun: NOW,
					nextRun: NOW + flow.delay,
				};
				//TODO: remove any queue item that is done?
			}
			poll.setQueue(pollQueue);
		}, 1000);
	},

	pushToFlowQueue: (flow) => {
		flow.debug && poll.log('pushing flow to queue', { flow });
		const currQueue = StateManager.get('flowQueue', false, []);
		StateManager.update('flowQueue', [...currQueue, flow]);
	},
};

export const FlowPollManager = {
	init: (args) => {
		const { logLevel, queue = [] } = args;
		poll.logLevel = logLevel;
		poll.verbose('init', args);
		poll.setQueue(queue);
	},
	clearQueue: (debug = false) => {
		debug && poll.log('clearing queue');
		poll.setQueue([]);
	},
	dequeue: (flow) => {
		flow.debug && poll.log('de-queuing', flow);
		const currentPollQueue = poll.getQueue();
		const newPollQueue = currentPollQueue.filter((x) => x.key !== flow.key);
		poll.setQueue(newPollQueue);
	},
	queue: (flow) => {
		const newPollQueue = poll.getQueue();
		const isAlreadyInPool = newPollQueue.some((x) => x.key === flow.key);
		if (isAlreadyInPool) {
			poll.verbose('queue duplicate, skipping', flow);
			return;
		}
		if (flow.debug) {
			poll.log('queuing', flow);
			poll.logLevel = 'verbose';
		}
		newPollQueue.push(flow);
		poll.verbose('updating queue to', newPollQueue);
		poll.setQueue(newPollQueue);
	},
};
