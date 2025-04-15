import { StateManager } from '../../../../../state/state';
import { getOptions } from './optionsHelper';

describe('optionsHelper', () => {
	// ? default/correct case
	it('getOptions with intact,filled: global_*, valid array', () => {
		// ? propsFilled was filled by fill() function on MUI/index.tsx, based on propsIntact.options tokenizable value
		const propsIntact = { options: 'global_something' };
		const propsFilled = { options: [{ label: 'aa', value: 123 }] };

		const results = getOptions(propsIntact, propsFilled);
		expect(results).toEqual([{ label: 'aa', value: 123 }]);
	});

	// ? props filled is null and null is a value that state can return, defaults to empty array
	it('getOptions with intact,filled: null, null', () => {
		const propsIntact = { options: null };
		const propsFilled = { options: null };
		const results = getOptions(propsIntact, propsFilled);
		expect(results).toEqual([]);
	});

	// ? props filled is {} and {} is a value that state can return, defaults to empty array
	it('getOptions with intact,filled: null, {}', () => {
		const propsIntact = { options: null };
		const propsFilled = { options: {} };

		const results = getOptions(propsIntact, propsFilled);
		expect(results).toEqual([]);
	});

	// ? props filled is null and null is a value that state can return, it ignores whatever is inside global_foo, defaults to empty array
	it('getOptions with intact,filled: global_*, {}', () => {
		StateManager.update('foo', []);
		const propsIntact = { options: 'global_foo' };
		const propsFilled = { options: null };

		const results = getOptions(propsIntact, propsFilled);
		expect(results).toEqual([]);
	});

	// ? props filled is undefined and undefined means:
	// * 		1. "state does not exist"
	// * 		or 2. propsIntact.options does not have 'global_' prefix but is still a valid state.
	// ? so we check if (2) is correct. if state does exist and it is an array, we use it
	it('getOptions with intact,filled: path to state without global_, undefined', () => {
		StateManager.update('foo', [{ b: 1 }]);
		const propsIntact = { options: 'foo' };
		const propsFilled = { options: undefined };

		const results = getOptions(propsIntact, propsFilled);
		expect(results).toEqual([{ b: 1 }]);
	});

	// ? same as previous case, but now state returns 1234, which is an invalid value, defaults to empty array
	it('getOptions with intact,filled: path to state without global_, undefined - but now state has invalid value', () => {
		StateManager.update('bar', 1234);
		const propsIntact = { options: 'bar' };
		const propsFilled = { options: null };

		const results = getOptions(propsIntact, propsFilled);
		expect(results).toEqual([]);
	});
});
