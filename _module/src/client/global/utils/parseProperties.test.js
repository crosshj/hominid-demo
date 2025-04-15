import { format } from 'date-fns';
import {
	replaceTokens,
	fillPropsWithTokens,
	getIncludesProps,
	withNamespaced,
	parseProperties,
	StringFormatters,
	applyInputProps,
	ApplyStringFormatters,
} from './parseProperties';

describe('replace tokens', () => {
	it('when state undefined', () => {
		const result = replaceTokens(undefined, 'what happens here? {{prop}}');
		expect(result).toBe('what happens here? ');
	});

	it('when path does not contain token', () => {
		const result = replaceTokens({ myID: 1 }, 'i dont have a token');
		expect(result).toBe('i dont have a token');
	});

	it('should replace token with value', () => {
		const state = { prop: 'foo' };
		const result = replaceTokens(state, 'what happens here? {{prop}}');
		expect(result).toBe('what happens here? foo');
	});

	it('should replace token with value (2) - with break lines', () => {
		const state = {
			prop: 'Results submitted with: {\n  "clientId": "15"\n}',
		};
		const result = replaceTokens(state, 'results: {{prop}}');
		expect(result).toBe(`results: ${state.prop}`);
	});

	it('should replace token with value (3) - with global preffix', () => {
		const state = { myID: '7' };
		const result = replaceTokens(
			state,
			'what is the number of perfection? A: {{global_myID}}',
		);
		expect(result).toBe('what is the number of perfection? A: 7');
	});

	it('should default to empty string if value is undefined', () => {
		const state = {};
		const result = replaceTokens(state, 'what happens here? {{prop}}');
		expect(result).toBe('what happens here? ');
	});
});

describe('fillPropsWithTokens', () => {
	it('nested: process flowArgs then global', () => {
		const path = 'global_list[flowArgs.index].foo';
		const states = {
			global: { list: [{ foo: 'bar' }] },
			flowArgs: { index: 0 },
		};
		const result = fillPropsWithTokens({ path }, states);
		expect(result).toEqual({ path: 'bar' });
	});
	it('nested: but only replace flowArgs', () => {
		const path = 'global_list[flowArgs.index].foo';
		const states = {
			flowArgs: { index: 0 },
		};
		const result = fillPropsWithTokens({ path }, states, ['flowArgs']);
		expect(result).toEqual({ path: 'global_list[0].foo' });
	});
	it('replace by array from flowArgs', () => {
		const data = 'flowArgs.newValue';
		const dataSources = {
			flowArgs: { newValue: [1, 2, 999] },
		};
		const result = fillPropsWithTokens({ data }, dataSources, ['flowArgs']);

		expect(result.data).toEqual([1, 2, 999]);
		expect(Object.keys(result)).toEqual(['data']);
		expect(Object.keys(result).length).toEqual(1);
	});

	it('replace by whole flowArgs', () => {
		const data = 'flowArgs';
		const dataSources = {
			results: undefined,
			global: undefined,
			flowArgs: { a: 2, 5: 'c' },
		};
		const { dataFilled } = fillPropsWithTokens(
			{ dataFilled: data },
			dataSources,
			['flowArgs', 'global', 'results'],
		);

		expect(dataFilled).toEqual({ a: 2, 5: 'c' });
	});

	it('replace by flowArgs path', () => {
		const data = 'flowArgs.newValue';
		const dataSources = {
			flowArgs: { newValue: { a: 2, 5: 'c' } },
		};
		const result = fillPropsWithTokens({ data }, dataSources, ['flowArgs']);

		expect(result.data).toEqual({ a: 2, 5: 'c' });
		expect(Object.keys(result)).toEqual(['data']);
		expect(Object.keys(result).length).toEqual(1);
	});
});

describe('getIncludesProps', () => {
	it('should return whether props INCLUDES statement is true or false', () => {
		const result = getIncludesProps(
			{
				checked: '{{ global_selectedRows INCLUDES row_myID }}',
				prop1: 'shouldBeIgnored',
				prop2: null,
				prop3: undefined,
			},
			{
				global: {
					selectedRows: [1, 2],
				},
				row: {
					myID: 1,
				},
			},
		);

		expect(result).toEqual({ checked: true });
	});

	it('should return false if required data is missing (1)', () => {
		const result = getIncludesProps(
			{
				checked: '{{ global_SubStepsID INCLUDES row_myID }}',
			},
			{
				global: {
					SubStepsID: [10, 100, 1000],
				},
				// row undefined, not able to parse correctly
				row: undefined,
			},
		);

		expect(result).toEqual({ checked: false });
	});

	it('should return false if there there are missing data (2)', () => {
		const result = getIncludesProps(
			{
				checked: '{{ global_SubStepsID INCLUDES row_myID }}',
			},
			{
				// global is empty object without SubStepsID, not able to parse correctly
				global: {},
				row: {
					myID: 100,
				},
			},
		);

		expect(result).toEqual({ checked: false });
	});

	it('should return empty when providing empty props', () => {
		const result = getIncludesProps(
			{},
			{
				global: { something: 1 },
				row: {
					myID: 100,
				},
			},
		);

		expect(result).toEqual({});
	});

	it('should return empty when providing only props that dont have INCLUDES statement', () => {
		const result = getIncludesProps(
			{
				prop1: 'hasThisValue',
				prop2: 'another',
				prop3: 100,
				prop4: 'crazyFrog',
				michaelScott: 'qpw[epqw[e',
				dwight: 'null',
				index: null,
			},
			{
				global: { something: 1 },
				row: {
					myID: 100,
				},
			},
		);

		expect(result).toEqual({});
	});
});

describe('namespaced properties', () => {
	it('with sx:display', () => {
		const result = withNamespaced({
			'sx:display': 'none',
			justifyContent: 'center',
		});
		expect(result.sx).toEqual({ display: 'none' });
	});
	it('with sx:display & display', () => {
		const result = withNamespaced({
			'sx:display': 'none',
			display: 'flex',
		});
		expect(result.sx).toEqual({ display: 'none' });
		expect(result.display).toEqual('flex');
	});
	it('with sx:display & legacy sx prop (will override, but maintain others)', () => {
		const result = withNamespaced({
			sx: { display: 'flex', justifyContent: 'center' },
			'sx:display': 'none',
		});
		expect(result.sx).toEqual({
			display: 'none',
			justifyContent: 'center',
		});
	});
	it('with sx:display & legacy sx prop (will override, but maintain others) (2)', () => {
		const result = withNamespaced({
			'sx:display': 'none',
		});
		expect(result.sx).toEqual({
			display: 'none',
		});
	});
	it('with even more nested stuff', () => {
		const result = withNamespaced({
			'sx:maxWidth-xs': '100% !important',
			'sx:maxWidth-md': '100% !important',
			'sx:display': 'block',
			'sx:gridColumn': '1',
			'sx:gridRow': '3',
			'sx:textAlign': 'center',
		});
		expect(result.sx).toEqual({
			maxWidth: {
				xs: '100% !important',
				md: '100% !important',
			},

			display: 'block',

			gridColumn: '1',
			gridRow: '3',

			textAlign: 'center',
		});
	});
	it('with other data types', () => {
		const result = withNamespaced({
			'sx:display': 'none',
			checked: false,
			value: '1111222',
			false: 1,
			'myCrazyObject:prop1': true,
			'myCrazyObject:prop2': false,
		});
		expect(result).toEqual({
			sx: { display: 'none' },
			checked: false,
			value: '1111222',
			false: 1,
			myCrazyObject: { prop1: true, prop2: false },
		});
	});
});

describe('parseProperties', () => {
	it('should parse inputProps', () => {
		const result = parseProperties(
			'min:2019-01-24T00:00,max:2020-05-31T00:00',
		);

		expect(result).toEqual({
			min: '2019-01-24T00:00',
			max: '2020-05-31T00:00',
		});
	});
});

describe('string formatters: date', () => {
	it('day start', () => {
		const dateFromDB = '2009-07-08T00:00:00.000Z';
		const expected = '07/08/09';
		const result = StringFormatters.date(dateFromDB);
		expect(result).toEqual(expected);
	});
	it('day end', () => {
		const dateFromDB = '2009-07-08T23:59:59.999Z';
		const expected = '07/08/09';
		const result = StringFormatters.date(dateFromDB);
		expect(result).toEqual(expected);
	});
	it('day start (outside DST)', () => {
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const expected = '11/22/23';
		const result = StringFormatters.date(dateFromDB);
		expect(result).toEqual(expected);
	});
	it('distance no assume - days ago', () => {
		const nowDate = '2023-11-28T00:00:00.000Z';
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const expected = '6 days ago';
		const result = StringFormatters.datedistancenoassume(
			dateFromDB,
			nowDate,
		);
		expect(result).toEqual(expected);
	});
	it('distance no assume - hours ago', () => {
		const nowDate = '2023-11-22T01:00:00.000Z';
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const expected = 'about 1 hour ago';
		const result = StringFormatters.datedistancenoassume(
			dateFromDB,
			nowDate,
		);
		expect(result).toEqual(expected);
	});
	it('distance no assume - minutes ago', () => {
		const nowDate = '2023-11-22T00:05:00.000Z';
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const expected = '5 minutes ago';
		const result = StringFormatters.datedistancenoassume(
			dateFromDB,
			nowDate,
		);
		expect(result).toEqual(expected);
	});
	it('distance no assume - months ago', () => {
		const nowDate = '2024-02-22T01:00:00.000Z';
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const expected = '3 months ago';
		const result = StringFormatters.datedistancenoassume(
			dateFromDB,
			nowDate,
		);
		expect(result).toEqual(expected);
	});
});

describe('string formatters: time', () => {
	it('day start', () => {
		const dateFromDB = '2009-07-08T00:00:00.000Z';
		const expected = '12:00:00 AM';
		const result = StringFormatters.time(dateFromDB);
		expect(result).toEqual(expected);
	});
	it('near day end', () => {
		const dateFromDB = '2009-07-08T23:59:59.999Z';
		const expected = '11:59:59 PM';
		const result = StringFormatters.time(dateFromDB);
		expect(result).toEqual(expected);
	});
	it('day start (outside DST)', () => {
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const expected = '12:00:00 AM';
		const result = StringFormatters.time(dateFromDB);
		expect(result).toEqual(expected);
	});
});

describe('applyInputProps', () => {
	it('should apply props', () => {
		const target = {};
		applyInputProps(
			{
				_src: {
					inputProps: 'min:2019-01-24T00\\:00;max:2020-05-31T00\\:00',
				},
			},
			target,
		);
		expect(target).toEqual({
			inputProps: {
				max: '2020-05-31T00:00',
				min: '2019-01-24T00:00',
			},
		});
	});
	it('should apply props with TODAY keyword', () => {
		const target = {};
		applyInputProps(
			{
				_src: {
					inputProps: 'min:TODAY;max:TODAY',
				},
			},
			target,
		);
		const _today = format(new Date(), 'yyyy-MM-dd');
		expect(target).toEqual({
			inputProps: {
				max: _today + 'T23:59',
				min: _today + 'T00:00',
			},
		});
	});
});

describe('apply string formatters: dateFormat', () => {
	it('dateFormat: with weekday name', () => {
		const dateFromDB = '2009-07-08T00:00:00.000Z';
		const expected = 'Wednesday, July 8th';
		const result = ApplyStringFormatters(
			dateFromDB,
			`dateFormat[EEEE, MMMM do]`,
		);
		expect(result).toEqual(expected);
	});
});
