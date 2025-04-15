import { WebWorkerFactory } from './workerFactory.js';
import { StateManager } from '../../state/state.js';
import { toast } from 'react-toastify';

interface WorkerConfig {
	startAt: number;
	every: number;
	event: string;
	eventCode: string;
	pathToUpdate: string;
	shouldPoll?: (...args: any) => boolean;
	onMessageCb: (...args: any) => {};
	onErrorCb: (...args: any) => {};
}

const STOP_POLLING_AFTER_AMOUNT_OF_SEQUENTIAL_ERRORS = 5;

interface FallbackHandlerType {
	_map: Record<string, number>;
	count: (eventCode: string) => void;
	clearCount: (eventCode: string) => void;
	shouldStopPolling: (eventCode: string) => boolean;
}
const FallbackHandler: FallbackHandlerType = {
	_map: {},
	clearCount: (eventCode) => {
		FallbackHandler._map[eventCode] = 0;
	},
	count: (eventCode) => {
		const prevValue = FallbackHandler._map[eventCode] || 0;
		FallbackHandler._map[eventCode] = prevValue + 1;
	},
	shouldStopPolling: (eventCode) => {
		if (
			FallbackHandler._map[eventCode] <
			STOP_POLLING_AFTER_AMOUNT_OF_SEQUENTIAL_ERRORS
		) {
			return false;
		}

		return true;
	},
};

export const WorkerAttacher = {
	poll: (workerSrc: string, configSrc: WorkerConfig) => {
		const worker = new WebWorkerFactory(workerSrc) as Worker;
		const config = configSrc || {};
		const { shouldPoll, startAt = 1000, every } = config;
		let pollIntervalId: string | number | NodeJS.Timeout | undefined;

		worker.addEventListener('message', (event: any) => {
			if (event.data.error) {
				if (FallbackHandler.shouldStopPolling(config.eventCode)) {
					worker.terminate();
					pollIntervalId && clearInterval(pollIntervalId);
				}

				config.onErrorCb({ event, toast, StateManager });
				FallbackHandler.count(config.eventCode);
				return;
			}

			if (event.data) {
				FallbackHandler.clearCount(config.eventCode);
				config.onMessageCb({ event, toast, StateManager });
				return;
			}
		});

		const requestNotifications = () => {
			const doPoll =
				typeof shouldPoll === 'function'
					? shouldPoll({ StateManager })
					: true;
			if (!doPoll) return;
			worker.postMessage({
				eventCode: config.eventCode,
				eventTime: new Date().toISOString(),
			});
		};

		setTimeout(() => {
			requestNotifications();
			if (typeof every !== 'undefined') {
				pollIntervalId = setInterval(requestNotifications, every);
			}
		}, startAt);

		(worker as any).toast = toast;

		return worker;
	},
};
