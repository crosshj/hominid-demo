import { whenRunner } from '../global/utils/whenConditions.js';

export const scenario1 = {
	eventList: [
		{ module: 'MESSAGE', threadId: 1, messageId: 1 },
		{ module: 'MESSAGE', threadId: 1, messageId: 2 },
		{ module: 'WORKFLOW', processId: 1, step: 0 },
		{ module: 'WORKFLOW', processId: 1, step: 1 },
		{ module: 'MESSAGE', threadId: 2, messageId: 1 },
		{ module: 'MESSAGE', threadId: 2, messageId: 2 },
	],
	triggerList: [
		{
			onEvent: 'WHEN event_module IS MESSAGE',
			'data.thread': 22,
			handler: 'fooHandler',
		},
	],
};

const Triggers = (triggerList) =>
	triggerList.map((t) => {
		return {
			...t,
			test: (event) => {
				const eventMatch = whenRunner(t.onEvent, { event });
				if (!eventMatch || !t.matches) return eventMatch;
				const matchesMatch = whenRunner(t.matches, { event });
				return eventMatch && matchesMatch;
			},
		};
	});

export const parseEvents = ({ triggerList, eventList }) => {
	const toTrigger = [];
	const toNotify = [];
	for (const trigger of Triggers(triggerList)) {
		const thisMatches = eventList.filter((event) => trigger.test(event));
		toTrigger.push({ trigger, events: thisMatches });
	}
	for (const event of eventList) {
		if (toTrigger.find(({ trigger }) => trigger.test(event))) continue;
		toNotify.push(event);
	}

	return { toNotify, toTrigger };
};
