import { StateManager } from '../../state/state';
import { handleSubscriber } from '../components/Subscribe';
import { parseProps } from './parseProps';

const STATEFUL_COMPONENTS = [
	// 'Data',
	// 'Flow',
	'Subscribe',
];
const EVENT_BASED_COMPONENTS = ['Trigger'];

const ALL_SPECIAL_COMPONENTS = [
	...STATEFUL_COMPONENTS,
	...EVENT_BASED_COMPONENTS,
];

export const isStatefulComponent = ({ type, parent }) => {
	// const is =
	// 	STATEFUL_COMPONENTS.includes(type) ||
	// 	EVENT_BASED_COMPONENTS.includes(type);

	// return is && parent === 'Page';
	return ALL_SPECIAL_COMPONENTS.includes(type);
};

const subscribedKeys = [];

const componentTypeToHandler = {
	Subscribe: handleSubscriber,
};

const handleEventBasedComponents = (eventBasedComponents) => {
	const flowsToTriggerNow = [];
	const flowsToTriggerOnClose = [];

	eventBasedComponents.forEach((c) => {
		const props = parseProps(c);

		// we are only supporting triggers for now
		// lets just early return instead of using nested ifs
		if (c.type !== 'Trigger') {
			return;
		}

		if (props.includesEventProp) {
			return;
		}

		if (props.onClose) {
			flowsToTriggerOnClose.push({ key: props.handler, args: {} });
			return;
		}

		flowsToTriggerNow.push({
			key: props.handler,
			args: {},
			debug: props.debug,
		});
	});

	const currentQueue = StateManager.get('flowQueue', false, []);

	const queueWithNewItems = [...currentQueue, ...flowsToTriggerNow];
	const newQueueDeduplicated = queueWithNewItems.reduce((queue, flow) => {
		if (queue.some((x) => x.key === flow.key)) {
			flow.debug &&
				console.log({
					_: 'Trigger:debug - flow is duplicated. skipping.',
					key: flow.key,
				});
			return queue;
		}

		flow.debug &&
			console.log({
				_: 'Trigger:debug - pushing flow to queue',
				key: flow.key,
			});
		queue.push(flow);
		return queue;
	}, currentQueue);

	StateManager.update('flowQueue', newQueueDeduplicated);
	StateManager.update('flowQueue:triggerOnClose', flowsToTriggerOnClose);
};

export const handleStatefulComponents = (allStatefulComponents) => {
	const eventBasedComponents = [];
	const statefulComponents = [];

	allStatefulComponents.forEach((c) => {
		if (EVENT_BASED_COMPONENTS.includes(c.type)) {
			eventBasedComponents.push(c);
		}

		if (STATEFUL_COMPONENTS.includes(c.type)) {
			statefulComponents.push(c);
		}
	});

	handleEventBasedComponents(eventBasedComponents);

	for (const component of statefulComponents) {
		const props = parseProps(component);

		const subKey = props.path || props.match;
		const componentSubscriptionKey = `${subKey}-${props.handler}`;
		if (subscribedKeys.includes(componentSubscriptionKey)) {
			continue;
		}

		const handler = componentTypeToHandler[component.type];

		if (!handler) {
			console.log(
				`Stateful component ${component.type} doesn't have a handler.`,
			);
			continue;
		}
		handler(props);
	}
};
