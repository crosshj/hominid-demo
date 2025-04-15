import {
	Select_Props_1,
	Select_Props_2,
	Input_Props_1,
} from '../shims/fixtures';
import { getStatefulProps } from './getStatefulProps';

describe('getStatefulProps', () => {
	it('should return dict of stateful props', () => {
		const result = getStatefulProps(Select_Props_1.propsIntact);

		expect(result).toEqual({
			value: {
				tokens: [
					{
						key: 'value',
						match: 'row_isYesNo',
						source: 'row',
						path: 'isYesNo',
						formatter: undefined,
					},
				],
				originalValue: 'row_isYesNo',
				pathsToListen: ['optionsExample1[0].isYesNo'],
			},
			options: {
				tokens: [
					{
						key: 'options',
						match: 'global_dataYesNo',
						source: 'global',
						path: 'dataYesNo',
						formatter: undefined,
					},
				],
				originalValue: 'global_dataYesNo',
				pathsToListen: ['dataYesNo'],
			},
		});
	});

	it('should return dict of stateful props (2)', () => {
		const result = getStatefulProps(Select_Props_2.propsIntact);

		expect(result).toEqual({
			options: {
				tokens: [
					{
						key: 'options',
						match: 'global_optionsExample2',
						source: 'global',
						path: 'optionsExample2',
						formatter: undefined,
					},
				],
				originalValue: 'global_optionsExample2',
				pathsToListen: ['optionsExample2'],
			},
			value: {
				tokens: [
					{
						key: 'value',
						match: 'global_selectedAssignment',
						source: 'global',
						path: 'selectedAssignment',
						formatter: undefined,
					},
				],
				originalValue: 'global_selectedAssignment',
				pathsToListen: ['selectedAssignment'],
			},
		});
	});

	it('should handle WHEN condition', () => {
		const props = {
			disabled: 'WHEN global_something THEN true ELSE false',
		};
		const result = getStatefulProps(props);
		expect(result.disabled.pathsToListen).toEqual(['something']);
	});

	it('should handle WHEN condition with AND', () => {
		const props = {
			display:
				'WHEN global_contact2Show IS true AND global_contact3Show IS false THEN flex ELSE none',
		};
		const result = getStatefulProps(props);
		expect(result.display.pathsToListen).toEqual([
			'contact2Show',
			'contact3Show',
		]);
	});

	it('should handle WHEN condition with OR', () => {
		const props = {
			display:
				'WHEN global_contact2Show IS true OR global_contact3Show IS false THEN flex ELSE none',
		};
		const result = getStatefulProps(props);
		expect(result.display.pathsToListen).toEqual([
			'contact2Show',
			'contact3Show',
		]);
	});

	it('should handle global_ + row_index correctly (1)', () => {
		const props = {
			options: 'global_someArray[row_index]',
			__rowIndex: 42,
		};
		const result = getStatefulProps(props, 'fillOwn');
		expect(result.options.pathsToListen).toEqual(['someArray[42]']);
	});

	it('match fillable props with colon and comma included, ie. dateFormat', () => {
		const props = {
			foo: 'global_foo:dateFormat[hh:mm:ss b dd/LL/yyyy O]',
		};
		const result = getStatefulProps(props, 'fillOwn');
		expect(result.foo.tokens[0].match).toEqual(
			'global_foo:dateFormat[hh:mm:ss b dd/LL/yyyy O]',
		);
		expect(result.foo.tokens[0].formatter).toEqual(
			'dateFormat[hh:mm:ss b dd/LL/yyyy O]',
		);
	});

	it('matches theme_ props', () => {
		const props = {
			background: 'theme_palette.success',
		};
		const result = getStatefulProps(props, 'fillOwn');
		expect(result.background.tokens[0].source).toBe('theme');
		expect(result.background.tokens[0].path).toBe('palette.success');
	});

	describe('Input', () => {
		it('should return dict of stateful props containing pathsToListen that uses __rowIndex and __rowStateKey', () => {
			const result = getStatefulProps(Input_Props_1.propsIntact);

			// assert __rowIndex and __rowStateKey
			expect(Input_Props_1.propsIntact.__rowIndex).toBe(0);
			expect(Input_Props_1.propsIntact.__rowStateKey).toBe(
				'inputTestData1',
			);

			expect(result).toEqual({
				value: {
					tokens: [
						{
							key: 'value',
							match: 'row_datetime',
							source: 'row',
							path: 'datetime',
							formatter: undefined,
						},
					],
					originalValue: 'row_datetime',
					pathsToListen: ['inputTestData1[0].datetime'],
				},
			});
		});
	});
});
