import { whenParser } from './whenConditions';

describe('when Condition parser (syntax)', () => {
	/*
		each test ran in for loop after this array
		each test is defined as:
		[
			string to parse,
			expected results from parse
		]
	*/
	const tests = [
		[
			'DEBUG WHEN childDedsCreateDedMethodSelected IS 1 THEN flex ELSE none',
			{
				conditions: [
					{
						when: 'childDedsCreateDedMethodSelected',
						isSrc: '1',
						is: '1',
					},
				],
				joiner: undefined,
				debug: true,
				then: 'flex',
				else: 'none',
			},
		],
		/* 	[
			'DEBUG   WHEN         showEducation    IS    true THEN true ELSE skip',
			{
				debug: true,
				when: 'showEducation',
				is: "true",
				then: "true",
				else: 'skip',
			},
		], */
		[
			'WHEN someVarName IS booleanValue THEN booleanValue ELSE someString',
			{
				debug: false,
				conditions: [
					{
						when: 'someVarName',
						is: 'booleanValue',
						isSrc: 'booleanValue',
					},
				],
				joiner: undefined,
				then: 'booleanValue',
				else: 'someString',
			},
		],
		[
			'DEBUG WHEN anotherVar IS someOtherString THEN 13',
			{
				debug: true,
				conditions: [
					{
						when: 'anotherVar',
						is: 'someOtherString',
						isSrc: 'someOtherString',
					},
				],
				joiner: undefined,
				then: '13',
			},
		],
		[
			'WHEN noElseVar IS true THEN true',
			{
				debug: false,
				conditions: [{ when: 'noElseVar', is: 'true', isSrc: 'true' }],
				then: 'true',
				joiner: undefined,
				else: undefined,
			},
		],
		[
			'DEBUG WHEN noThenElseVar IS cool',
			{
				debug: true,
				conditions: [
					{ when: 'noThenElseVar', is: 'cool', isSrc: 'cool' },
				],
				joiner: undefined,
				then: true,
				else: false,
			},
		],
		[
			'WHEN noIsThenElseVar',
			{
				debug: false,
				conditions: [{ when: 'noIsThenElseVar', is: undefined }],
				then: true,
				joiner: undefined,
				else: false,
			},
		],
		[
			'WHEN noIsVar THEN foo ELSE bar',
			{
				debug: false,
				conditions: [{ when: 'noIsVar', is: undefined }],
				then: 'foo',
				else: 'bar',
			},
		],
		[
			'WHEN noIsElseVar THEN bar',
			{
				debug: false,
				conditions: [{ when: 'noIsElseVar', is: undefined }],
				joiner: undefined,
				then: 'bar',
				else: undefined,
			},
		],
		[
			'WHEN noIsThenVar ELSE bar',
			{
				debug: false,
				conditions: [{ when: 'noIsThenVar', is: undefined }],
				joiner: undefined,
				then: true,
				else: 'bar',
			},
		],
		[
			'       WHEN     showEducation         ',
			{
				debug: false,
				conditions: [{ when: 'showEducation' }],
				joiner: undefined,
				then: true,
				else: false,
			},
		],
		[
			'DEBUG WHEN anotherVarForParseTrue IS true THEN TrueGotParsed',
			{
				debug: true,
				conditions: [
					{
						when: 'anotherVarForParseTrue',
						is: 'true',
						isSrc: 'true',
					},
				],
				then: 'TrueGotParsed',
				else: undefined,
				joiner: undefined,
			},
		],
		[
			'DEBUG WHEN anotherVarForParseFalse IS false THEN FalseGotParsed',
			{
				debug: true,
				conditions: [
					{
						when: 'anotherVarForParseFalse',
						is: 'false',
						isSrc: 'false',
					},
				],
				then: 'FalseGotParsed',
				else: undefined,
				joiner: undefined,
			},
		],
		[
			'DEBUG WHEN anotherVarForParseFalse IS false THEN FalseGotParsed',
			{
				debug: true,
				conditions: [
					{
						when: 'anotherVarForParseFalse',
						is: 'false',
						isSrc: 'false',
					},
				],
				then: 'FalseGotParsed',
				else: undefined,
				joiner: undefined,
			},
		],
		[
			'WHEN dotVar.child THEN value1 ELSE value2',
			{
				debug: false,
				conditions: [{ when: 'dotVar.child', is: undefined }],
				then: 'value1',
				else: 'value2',
				joiner: undefined,
			},
		],
		[
			'WHEN deep.0.nested IS 0 THEN flex ELSE none',
			{
				debug: false,
				conditions: [{ when: 'deep.0.nested', is: '0', isSrc: '0' }],
				then: 'flex',
				else: 'none',
				joiner: undefined,
			},
		],
		[
			'WHEN global_simple IS "Lorem ipsum" THEN true ELSE false',
			{
				debug: false,
				conditions: [
					{
						when: 'global_simple',
						is: 'Lorem ipsum',
						isSrc: 'Lorem ipsum',
					},
				],
				then: 'true',
				else: 'false',
				joiner: undefined,
			},
		],
	];

	//use this to isolate one of the cases above
	// it.only('parse: isolated case', () => {
	// 	const inputString = 'WHEN noIsThenVar ELSE bar'; // <<< your search string
	// 	const [when, then] = tests.find((x) => x[0].includes(inputString));
	// 	const parsed = whenParser(when);
	// 	expect(parsed).toEqual(then);
	// });

	for (const [when, then] of tests) {
		it(`parse: "${when}"`, () => {
			expect(whenParser(when)).toEqual(then);
		});
	}
});

describe('when Condition parser: (syntax) - AND/OR/NOT', () => {
	it('parse: AND', () => {
		const when = `WHEN x IS y AND a IS b THEN aa ELSE bb`;
		const then = {
			debug: false,
			conditions: [
				{ when: 'x', is: 'y', isSrc: 'y' },
				{ when: 'a', is: 'b', isSrc: 'b' },
			],
			joiner: 'AND',
			then: 'aa',
			else: 'bb',
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});

	it('parse: AND (multiple)', () => {
		const when = `WHEN x IS y AND a IS b AND c IS d THEN aa ELSE bb`;
		const then = {
			debug: false,
			conditions: [
				{ when: 'x', is: 'y', isSrc: 'y' },
				{ when: 'a', is: 'b', isSrc: 'b' },
				{ when: 'c', is: 'd', isSrc: 'd' },
			],
			joiner: 'AND',
			then: 'aa',
			else: 'bb',
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});
	it('parse: OR', () => {
		const when = `WHEN x IS y OR a IS b THEN aa ELSE bb`;
		const then = {
			debug: false,
			conditions: [
				{ when: 'x', is: 'y', isSrc: 'y' },
				{ when: 'a', is: 'b', isSrc: 'b' },
			],
			joiner: 'OR',
			then: 'aa',
			else: 'bb',
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});

	it('parse: OR (multiple)', () => {
		const when = `WHEN x IS y OR a IS b OR c IS d THEN aa ELSE bb`;
		const then = {
			debug: false,
			conditions: [
				{ when: 'x', is: 'y', isSrc: 'y' },
				{ when: 'a', is: 'b', isSrc: 'b' },
				{ when: 'c', is: 'd', isSrc: 'd' },
			],
			joiner: 'OR',
			then: 'aa',
			else: 'bb',
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});

	it('parse: IS NOT', () => {
		const when = `WHEN x IS NOT y THEN aa ELSE bb`;
		const then = {
			debug: false,
			conditions: [{ when: 'x', isnot: 'y', isnotSrc: 'y' }],
			then: 'aa',
			else: 'bb',
			joiner: undefined,
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});

	it('parse: IS / IS NOT + ANDs', () => {
		const when = `WHEN x IS NOT y AND a IS NOT b THEN aa ELSE bb`;
		const then = {
			debug: false,
			conditions: [
				{ when: 'x', isnot: 'y', isnotSrc: 'y' },
				{ when: 'a', isnot: 'b', isnotSrc: 'b' },
			],
			joiner: 'AND',
			then: 'aa',
			else: 'bb',
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});

	it('parse: GREATERTHAN', () => {
		const statement = 'WHEN global_Bal IS GreaterThan(1000)';
		const result = whenParser(statement, {});

		expect(result).toEqual({
			conditions: [
				{
					when: 'global_Bal',
					is: 'GreaterThan',
					isSrc: 'GreaterThan',
					numberToCompareWith: '1000',
				},
			],
			joiner: undefined,
			then: true,
			else: false,
			debug: false,
		});
	});

	it('parse: GREATEROREQUALTHAN', () => {
		const statement =
			'WHEN global_Bal IS GreaterOrEqualThan(-500) THEN display ELSE none';
		const result = whenParser(statement, {});

		expect(result).toEqual({
			conditions: [
				{
					when: 'global_Bal',
					is: 'GreaterOrEqualThan',
					isSrc: 'GreaterOrEqualThan',
					numberToCompareWith: '-500',
				},
			],
			joiner: undefined,
			then: 'display',
			else: 'none',
			debug: false,
		});
	});

	it('parse: LESSTHAN', () => {
		const statement = 'WHEN global_Bal IS LESSTHAN(200000) THEN 1 ELSE 0';
		const result = whenParser(statement, {});

		expect(result).toEqual({
			conditions: [
				{
					when: 'global_Bal',
					is: 'LESSTHAN',
					isSrc: 'LESSTHAN',
					numberToCompareWith: '200000',
				},
			],
			joiner: undefined,
			then: '1',
			else: '0',
			debug: false,
		});
	});

	it('parse: LESSOREQUALTHAN', () => {
		const statement =
			'WHEN global_Bal IS LESSOREQUALTHAN(2000000) THEN pleeeease ELSE nooooo';
		const result = whenParser(statement, {});

		expect(result).toEqual({
			conditions: [
				{
					when: 'global_Bal',
					is: 'LESSOREQUALTHAN',
					isSrc: 'LESSOREQUALTHAN',
					numberToCompareWith: '2000000',
				},
			],
			joiner: undefined,
			then: 'pleeeease',
			else: 'nooooo',
			debug: false,
		});
	});

	it('parse: expects empty quotes', () => {
		const when = `WHEN x IS ''`;
		const then = {
			debug: false,
			conditions: [{ when: 'x', is: '', isSrc: '' }],
			joiner: undefined,
			then: true,
			else: false,
		};
		const parsed = whenParser(when);
		expect(parsed).toEqual(then);
	});
});
