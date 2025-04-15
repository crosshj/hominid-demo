import { getNewData } from './getNewData';

describe('SetData', () => {
	it('should set a value to a string', () => {
		const data = 'hello';
		const dataSources = {};
		const output = getNewData({ data }, dataSources);
		expect(output).toBe('hello');
	});
	it('should set a value to true', () => {
		const data = true;
		const output = getNewData({ data });
		expect(output).toBe(true);
	});
	it('should set a value to false', () => {
		const data = false;
		const output = getNewData({ data });
		expect(output).toBe(false);
	});
	it('should set a value to static_false', () => {
		const data = 'static_false';
		const dataSources = {};
		const output = getNewData({ data }, dataSources);
		expect(output).toBe('false');
	});
	it('should set a value to static_true', () => {
		const data = 'static_true';
		const dataSources = {};
		const output = getNewData({ data }, dataSources);
		expect(output).toBe('true');
	});
	//TODO: this should pass
	it.skip('should support properties with _ in their name', () => {
		const data = 'flowArgs.PROP_VALUE, global_list[0].value';
		const sources = {
			flowArgs: {
				PROP_VALUE: 'flowArgsPropValue',
			},
			global: {
				PROP_VALUE: 'globalPropValue',
			},
		};
		const output = getNewData({ data }, sources);
		expect(output).toEqual('flowArgsPropValue');
	});
});
