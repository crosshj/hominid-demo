import { scenarios } from './event.scenarios';
import { parseEvents } from './events';

describe('events', () => {
	it('scenario 0: many trigger matches, but just one handler call', () => {
		const { toTrigger, toNotify } = parseEvents(scenarios[0]);
		expect(toTrigger.length).toBe(1);
		expect(toTrigger[0].trigger.handler).toBe('fooHandler');
		expect(toTrigger[0].events.length).toBe(4);
		expect(toNotify.length).toBe(2);
	});
	it('scenario 1: multiple matching triggers', () => {
		const { toTrigger, toNotify } = parseEvents(scenarios[1]);
		expect(toTrigger.length).toBe(2);
		expect(toTrigger[0].trigger.handler).toBe('fooHandler');
		expect(toTrigger[1].trigger.handler).toBe('barHandler');
		expect(toNotify.length).toBe(0);
	});
	it.todo('onEvent + matches (or whatever we call them)');
});
