/*
 * @jest-environment jsdom
 */
import { StateManager } from '../../../state/state';
import { shouldHandle, processEvent } from './notificationLogic';

const CONTEXT_W_TRIGGER = [
	{
		type: 'Trigger',
		properties:
			'handler:handleIt,eventESCAPED_COLONfoo:global_first,eventESCAPED_COLONbar:global_second',
	},
];
const EXAMPLE_EVENT = {
	causedByFirstName: 'Org',
	CausedByLastName: 'Management',
	Comments: '',
	CreatedDT: '2024-02-29T19:49:10.430Z',
	EventCausedByUserID: 'C79DB61A-CF09-4772-8B95-ECBAA12C9C46',
	EventDT: '2024-02-29T19:49:10.427Z',
	EventLogID: 24,
	EventName: 'Client Activated',
	NotificationBody:
		'Client activation request for [Approved Client] has been approved!',
	NotificationID: 90,
	NotificationTargetUserID: 'D10DDD9F-F068-40E6-B44A-B1F8B83BE2DB',
	NotificationType: 'SYSTEM',
	ReadDT: null,
	SentDT: '2024-02-29T19:49:10.430Z',
	SentSuccessful: true,
	SubjectID: '2497',
	TriggerConditions:
		'User successfully reviews the Activation Approval form and selects "Approve Activation".',
	TriggerDescription: 'Corporate user approves client activation request.',
	routeID: 4,
	routeName: '/clientDetails/',
	routeTargetID: '/clientDetails/',
	routeToken: 'clientid',
	sendToExt: '',
};

describe('notificationLogic: shouldHandle', () => {
	it('handles UIContext updates', () => {
		const willHandle = shouldHandle({
			path: 'UIContext',
			value: [],
		});
		expect(willHandle).toBe(true);
	});
	it('handles notifications updates', () => {
		const willHandle = shouldHandle({
			path: '_internal:notifications',
			value: { notifications: ['some notifications'] },
		});
		expect(willHandle).toBe(true);
	});
	it('handles dependant data', () => {
		const willHandleContext = shouldHandle({
			path: 'UIContext',
			value: CONTEXT_W_TRIGGER,
		});
		const willHandleFirst = shouldHandle({
			path: 'first',
		});
		const willHandleSecond = shouldHandle({
			path: 'second',
		});
		expect(willHandleContext).toBe(false);
		expect(willHandleFirst).toBe(false);
		expect(willHandleSecond).toBe(true);
	});
	it('handles dependant data with timeout', async () => {
		const willHandleContext = shouldHandle({
			path: 'UIContext',
			value: CONTEXT_W_TRIGGER,
		});
		const LONG_DELAY = 4000;
		await new Promise((resolve) => setTimeout(resolve, LONG_DELAY));
		const willUseNextRandomEvent = shouldHandle({
			path: 'someUnrelatedUpdate',
		});
		expect(willHandleContext).toBe(false);
		expect(willUseNextRandomEvent).toBe(true);
	});
});

describe('notificationLogic: processEvent', () => {
	it('handles empty state', () => {
		StateManager.init({});
		const { notify, trigger, markRead } = processEvent();
		expect(notify).toEqual([]);
		expect(trigger).toEqual([]);
		expect(markRead).toEqual([]);
	});
	it('handles notification + context + dependent data', () => {
		const stateScenario = {
			'_internal:notifications': {
				notifications: [
					{
						foo: 'foo',
						bar: 'bar',
						NotificationID: 91,
					},
					EXAMPLE_EVENT,
				],
			},
			UIContext: CONTEXT_W_TRIGGER,
			first: 'foo',
			second: 'bar',
		};
		StateManager.init(stateScenario);
		const { notify, trigger, markRead } = processEvent();
		expect(notify).toEqual([
			{
				...EXAMPLE_EVENT,
				NotificationBody: 'Client Activated by undefined Management',
			},
		]);
		expect(trigger).toEqual([
			{
				handler: 'handleIt',
				notificationsToRead: [
					stateScenario['_internal:notifications'].notifications[0],
				],
			},
		]);
		expect(markRead).toEqual([
			stateScenario['_internal:notifications'].notifications[0]
				.NotificationID,
		]);
	});
});
