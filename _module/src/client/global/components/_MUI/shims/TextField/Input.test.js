import { format, isMatch } from 'date-fns';

import { Input, coerceInputEventValue, getAndFormatInputValue } from './Input';
import { Input_Props_1, Input_Props_2 } from '../fixtures';
import { StateManager } from '../../../../../state/state';

describe('Input', () => {
	it('should return expected props', () => {
		const { propsShimmed } = Input(Input_Props_1);

		expect(Object.keys(propsShimmed).length).toBe(7);

		expect(propsShimmed.fullWidth).toBe(true);
		expect(propsShimmed.value).toBe('2019-05-24T19:30');
		expect(typeof propsShimmed.inputProps).toBe('object');
		expect(typeof propsShimmed.onChange).toBe('function');

		expect(Object.keys(propsShimmed.inputProps).length).toBe(2);
		expect(propsShimmed.inputProps.min).toBe('2019-01-24T00:00');
		expect(propsShimmed.inputProps.max).toBe('2020-05-31T00:00');
	});

	it('should return expected props (2)', () => {
		const { propsShimmed } = Input(Input_Props_2);

		expect(Object.keys(propsShimmed).length).toBe(6);

		expect(propsShimmed.fullWidth).toBe(true);
		expect(propsShimmed.value).toBe(1000);
		expect(typeof propsShimmed.onChange).toBe('function');
	});

	describe('coerceInputEventValue', () => {
		it('should not coerce when coerce property is any value different than true', () => {
			const cases = [
				undefined,
				null,
				false,
				'false',
				'null',
				'undefined',
				{},
				[],
			];

			for (const value of cases) {
				const result = coerceInputEventValue(value, {
					coerce: undefined,
				});
				expect(result).toBe(value);
			}
		});

		it('coerce is true - should coerce to null if val is empty string', () => {
			const result = coerceInputEventValue('', { coerce: true });
			expect(result).toBe(null);
		});

		it('coerce is true - should coerce to number if val can be a number (and it does not start or end with spaces)', () => {
			const cases = [
				{ source: '123', coerced: 123 },
				{ source: String(1599999999), coerced: 1599999999 },
				{ source: '0.95', coerced: 0.95 },
				{ source: '0.95', coerced: 0.95 },

				// we do not trim
				{ source: '111 ', coerced: '111 ' },
				{ source: '  555', coerced: '  555' },
			];

			for (const { coerced, source } of cases) {
				const result = coerceInputEventValue(source, {
					coerce: true,
				});
				expect(result).toBe(coerced);
			}
		});
	});

	describe('getAndFormatInputValue', () => {
		afterEach(() => {
			StateManager.init({});
		});

		describe('logic', () => {
			it('#1 - gets value from state through useData prop', () => {
				StateManager.update('prop1', { a: 2, b: 4 });
				const result = getAndFormatInputValue({
					useDataProp: 'prop1',
					inputType: 'text',
					propsFilled: { value: undefined },
					formatter: undefined,
				});

				expect(result).toBe(JSON.stringify({ a: 2, b: 4 }, null, 2));
			});

			it('#2 - tries to get value from propsFilled.value if state is undefined', () => {
				StateManager.update('prop2', undefined);

				const result = getAndFormatInputValue({
					useDataProp: 'prop2',
					inputType: 'text',
					propsFilled: { value: '123' },
					formatter: undefined,
				});

				expect(result).toBe('123');
			});

			it('#2.1 - tries to get value from propsFilled.value if useDataProp is empty', () => {
				const result = getAndFormatInputValue({
					useDataProp: '',
					inputType: 'text',
					propsFilled: { value: '123' },
					formatter: undefined,
				});

				expect(result).toBe('123');
			});

			it('#3 - defaults to empty string if both state and propsFilled.value are undefined', () => {
				StateManager.update('prop3', undefined);

				const result = getAndFormatInputValue({
					useDataProp: 'prop3',
					inputType: 'text',
					propsFilled: { value: undefined },
					formatter: undefined,
				});

				expect(result).toBe('');
			});

			it('#4 - state is undefined and propsFilled.value is NOT undefined', () => {
				StateManager.update('prop4', undefined);
				const result = getAndFormatInputValue({
					useDataProp: 'prop4',
					inputType: 'text',
					propsFilled: { value: 123 },
					formatter: undefined,
				});

				expect(result).toBe(123);
			});

			it('#4.1 - state is undefined and propsFilled.value is NOT undefined', () => {
				StateManager.update('prop4-1', undefined);

				const result = getAndFormatInputValue({
					useDataProp: 'prop4-1',
					inputType: 'text',
					propsFilled: { value: { a: 2 } },
					formatter: undefined,
				});

				expect(result).toBe(JSON.stringify({ a: 2 }, null, 2));
			});

			it('#4.2 - state is undefined and propsFilled.value is NOT undefined', () => {
				StateManager.update('prop4-2', undefined);
				const value = new Date().toISOString();
				const result = getAndFormatInputValue({
					useDataProp: 'prop4-2',
					inputType: 'datetime',
					propsFilled: { value },
					formatter: undefined,
				});

				expect(result).toBe(value);
			});

			describe('convert date values to specific formats based on inputType', () => {
				it('#5 - datetime-local', () => {
					const now = new Date().toISOString();
					const result = getAndFormatInputValue({
						inputType: 'datetime-local',
						propsFilled: { value: now },
						useDataProp: undefined,
						formatter: undefined,
					});

					expect(result).not.toBe(now);
					expect(isMatch(result, "yyyy-MM-dd'T'HH:mm")).toBe(true);
				});
				it('#6 - date', () => {
					const now = new Date().toISOString();
					const result = getAndFormatInputValue({
						inputType: 'date',
						propsFilled: { value: now },
						useDataProp: undefined,
						formatter: undefined,
					});

					expect(result).not.toBe(now);
					expect(isMatch(result, 'yyyy-MM-dd')).toBe(true);
				});
				it('#7 - month', () => {
					const now = new Date().toISOString();
					const result = getAndFormatInputValue({
						inputType: 'month',
						propsFilled: { value: now },
						useDataProp: undefined,
						formatter: undefined,
					});

					expect(result).not.toBe(now);
					expect(isMatch(result, 'yyyy-MM')).toBe(true);
				});
			});

			xdescribe('formatters', () => {});
		});

		describe('ensure it formats everything into string', () => {
			describe('objects (except null)', () => {
				it('#1 - propsFilled.value is a real object', () => {
					const value = { a: 1 };

					const result = getAndFormatInputValue({
						useDataProp: undefined,
						formatter: undefined,
						propsFilled: { value },
						inputType: 'text',
					});

					expect(result).toBe(JSON.stringify(value, null, 2));
				});

				it('#2 - propsFilled.value is an array', () => {
					const value = [{ b: 200 }];

					const result = getAndFormatInputValue({
						useDataProp: undefined,
						formatter: undefined,
						propsFilled: { value },
						inputType: 'text',
					});

					expect(result).toBe(JSON.stringify(value, null, 2));
				});
			});

			describe('null values', () => {
				it('#1 - undefined useDataProp, which makes value come from propsFilled', () => {
					const result = getAndFormatInputValue({
						useDataProp: undefined,
						formatter: undefined,
						propsFilled: { value: null },
						inputType: 'text',
					});

					expect(result).toBe('');
				});

				it('#2 - same as #1, but with input type = date', () => {
					const result = getAndFormatInputValue({
						useDataProp: undefined,
						formatter: undefined,
						propsFilled: { value: null },
						inputType: 'date',
					});

					expect(result).toBe('');
				});

				it('#3 - useDataProp leading to NULL state value', () => {
					StateManager.update('myNullPropFromState', null);
					const result = getAndFormatInputValue({
						useDataProp: 'myNullPropFromState',
						formatter: undefined,
						propsFilled: { value: 'otherValue' },
						inputType: 'text',
					});

					expect(result).toBe('');
				});
			});

			describe('undefined values', () => {
				it('#1 - undefined useDataProp, which makes value come from propsFilled', () => {
					const result = getAndFormatInputValue({
						useDataProp: undefined,
						formatter: undefined,
						propsFilled: { value: undefined },
						inputType: 'text',
					});

					expect(result).toBe('');
				});

				it('#2 - same as #1, but with input type = date', () => {
					const result = getAndFormatInputValue({
						useDataProp: undefined,
						formatter: undefined,
						propsFilled: { value: undefined },
						inputType: 'date',
					});

					expect(result).toBe('');
				});

				it('#3 - useDataProp leading to UNDEFINED state value, thus value comes from propsFilled.value', () => {
					const result = getAndFormatInputValue({
						useDataProp: 'nonExistentKey',
						propsFilled: { value: 'otherValue' },
						inputType: 'text',
						formatter: undefined,
					});

					expect(result).toBe('otherValue');
				});
			});

			// it.only('null', () => {
			// first from state manager, then from propsFilled.value
			// const result_4 = getAndFormatInputValue({
			// 	useDataProp: 'nonExistentKey',
			// 	propsFilled: { value: 'otherValue' },
			// 	inputType: 'text',
			// 	formatter: undefined,
			// });
			// expect(result_4).toBe('otherValue');

			// same as case4 - but with inputType=date, which tries to convert the date to global TZ
			// const result_5 = getAndFormatInputValue({
			// 	useDataProp: 'nonExistentKey',
			// 	propsFilled: { value: 'otherValue' },
			// 	inputType: 'date',
			// 	formatter: undefined,
			// });

			// leads to empty string because "otherValue" is not a valid date
			// expect(result_5).toBe('');
			// });
		});
	});
});
