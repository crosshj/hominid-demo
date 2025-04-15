import { StateManager } from '../../../../state/state';
import { runFlow } from './runFlow';

describe('runFlow', () => {
	describe('href', () => {
		beforeEach(() => {
			StateManager.init({
				flowQueue: [],
				version: 0,
			});
		});

		it("should NOT push if href does not follow expected format with 'flow:'", () => {
			runFlow({
				propsIntact: {
					href: '',
				},
				propsFilled: {
					href: 'fromPropsFilled',
				},
			});

			runFlow({
				propsIntact: {
					href: '',
				},
				propsFilled: {
					href: 'flowfromPropsFilled',
				},
			});

			runFlow({
				propsIntact: {
					href: '',
				},
				propsFilled: {
					href: 'flow.fromPropsFilled',
				},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([]);
		});

		it('should push item to flowQueue with propsIntact and propsFilled', () => {
			runFlow({
				propsIntact: {
					href: '',
				},
				propsFilled: {
					href: 'flow:fromPropsFilled',
				},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{ key: 'fromPropsFilled', args: {} },
			]);
		});

		it('should push item to flowQueue with propsIntact and propsFilled (2)', () => {
			runFlow({
				propsIntact: {
					href: 'flow:fromPropsIntact',
				},
				propsFilled: {
					href: '',
				},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{ key: 'fromPropsIntact', args: {} },
			]);
		});

		it('should push item to flowQueue with propsIntact and propsFilled (3) - takes value from propsFilled first', () => {
			runFlow({
				propsIntact: {
					href: 'flow:fromPropsIntact',
				},
				propsFilled: {
					href: 'flow:fromPropsFilled',
				},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{ key: 'fromPropsFilled', args: {} },
			]);
		});

		it('should push item to flowQueue with ROW information', () => {
			StateManager.update('myRowValue', [
				{
					id: 10,
					label: 'my label',
				},
			]);

			runFlow({
				propsIntact: {
					__rowStateKey: 'myRowValue',
					__rowIndex: 0,
					href: 'flow:fromPropsIntact',
				},
				propsFilled: {},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'fromPropsIntact',
					args: {
						id: 10,
						label: 'my label',
						index: 0,
					},
				},
			]);
		});

		it('should push ALL flows to flowQueue (href with many flows separated by comma) with flowArgs', () => {
			StateManager.update('lalalalaWithMultipleFlows', [
				{
					id: 11,
					label: 'my label',
				},
			]);

			runFlow({
				propsIntact: {
					__rowStateKey: 'lalalalaWithMultipleFlows',
					__rowIndex: 0,
					href: 'flow:flow1,flow2,flow3,flow4',
				},
				propsFilled: {},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'flow1',
					args: {
						id: 11,
						label: 'my label',
						index: 0,
					},
				},
				{
					key: 'flow2',
					args: {
						id: 11,
						label: 'my label',
						index: 0,
					},
				},
				{
					key: 'flow3',
					args: {
						id: 11,
						label: 'my label',
						index: 0,
					},
				},
				{
					key: 'flow4',
					args: {
						id: 11,
						label: 'my label',
						index: 0,
					},
				},
			]);
		});

		it('should push item to flowQueue with ROW information AND additional args ', () => {
			StateManager.update('otherRow', [
				{
					id: 999,
					label: 'my label',
				},
			]);

			runFlow(
				{
					propsIntact: {
						__rowStateKey: 'otherRow',
						__rowIndex: 0,
						href: 'flow:fromPropsIntact',
					},
					propsFilled: {},
				},
				{
					flowArgs: {
						label: 'this one will replace the row..',
						moreStuff: 1,
					},
				},
			);

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'fromPropsIntact',
					args: {
						id: 999,
						label: 'this one will replace the row..',
						moreStuff: 1,
						index: 0,
					},
				},
			]);
		});

		it('should push item to flowQueue with only index if ROW info is undefined on state', () => {
			runFlow({
				propsIntact: {
					__rowStateKey: 'myRowValue',
					__rowIndex: 0,
					href: 'flow:fromPropsIntact',
				},
				propsFilled: {},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'fromPropsIntact',
					args: {
						index: 0,
					},
				},
			]);
		});
	});

	describe('flow prop', () => {
		beforeEach(() => {
			StateManager.init({
				flowQueue: [],
				version: 0,
			});
		});

		it('should push to queue when using flow prop', () => {
			runFlow({
				propsIntact: {
					flow: 'orewalaiandesu',
				},
				propsFilled: {},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'orewalaiandesu',
					args: {},
				},
			]);
		});

		it('should push to queue when using flow prop - including additional args if passed', () => {
			runFlow(
				{
					propsIntact: {
						flow: 'heyyoooo',
					},
					propsFilled: {},
				},
				{
					flowArgs: {
						label: 100,
						index: 9,
						toldyou: 'yes',
					},
				},
			);

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'heyyoooo',
					args: {
						label: 100,
						index: 9,
						toldyou: 'yes',
					},
				},
			]);
		});

		it('should NOT work if somehow flow prop is only on propsFilled and not on propsIntact', () => {
			runFlow({
				propsIntact: {},
				propsFilled: {
					flow: 'heyyoooo',
				},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([]);
		});
	});

	describe('useFlow prop', () => {
		beforeEach(() => {
			StateManager.init({
				flowQueue: [],
				version: 0,
			});
		});

		it('should push to queue when using using useFlow', () => {
			runFlow({
				propsIntact: {
					useFlow: 'konichiwa',
				},
				propsFilled: {},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'konichiwa',
					args: {},
				},
			]);
		});

		it('should push to queue when using using useFlow - including additional args if passed', () => {
			runFlow(
				{
					propsIntact: {
						useFlow: 'arigatogozaimasuka',
					},
					propsFilled: {},
				},
				{
					flowArgs: {
						label: 100,
						index: 9,
						toldyou: 'yes',
					},
				},
			);

			expect(StateManager.get('flowQueue')).toStrictEqual([
				{
					key: 'arigatogozaimasuka',
					args: {
						label: 100,
						index: 9,
						toldyou: 'yes',
					},
				},
			]);
		});

		it('should NOT work if somehow useFlow is only on propsFilled and not on propsIntact', () => {
			runFlow({
				propsIntact: {},
				propsFilled: {
					useFlow: 'orewalaiandesu',
				},
			});

			expect(StateManager.get('flowQueue')).toStrictEqual([]);
		});
	});
});

describe('extraArgs', () => {
	it('pass props prefixed with "flowArgs:" to flow args', () => {
		runFlow({
			propsIntact: {
				href: 'flow:myFlow',
				'flowArgs:foo': 25,
			},
		});
		expect(StateManager.get('flowQueue')[0].args).toStrictEqual({
			foo: 25,
		});
	});
});
