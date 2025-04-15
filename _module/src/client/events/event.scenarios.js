export const scenarios = [
	{
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
				handler: 'fooHandler',
			},
		],
	},
	{
		eventList: [{ module: 'MESSAGE', threadId: 1, messageId: 1 }],
		triggerList: [
			{
				onEvent: 'WHEN event_module IS MESSAGE',
				handler: 'fooHandler',
			},
			{
				onEvent: 'WHEN event_module IS MESSAGE',
				handler: 'barHandler',
			},
		],
	},
];
