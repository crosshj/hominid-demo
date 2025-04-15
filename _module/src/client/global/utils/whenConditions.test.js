import _ from 'lodash';
import { whenParser, whenRunner } from './whenConditions';
import { cookieOperations } from './cookies';
import { StateManager } from '../../state/state';

describe('when Condition runner', () => {
	/* standard syntax:
		'WHEN w IS x THEN y ELSE z'
	*/
	it('returns "shown" for showEducation when true', () => {
		const state = { showEducation: true };
		const statement = 'WHEN showEducation IS true THEN shown ELSE hidden';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual('shown');
	});
	it('returns "hidden" for showEducation when false', () => {
		const state = { showEducation: false };
		const statement = 'WHEN showEducation IS true THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('hidden');
	});

	/* shorter syntax:
		'WHEN x THEN shown ELSE hidden'
		equivalent to
		'WHEN x IS true THEN shown ELSE hidden'
	*/
	it('returns "shown" for showEducation when true (shorter)', () => {
		const state = { showEducation: true };
		const statement = 'WHEN showEducation THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('shown');
	});
	it('returns "hidden" for showEducation when true (shorter)', () => {
		const state = { showEducation: false };
		const statement = 'WHEN showEducation THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('hidden');
	});

	// IS DEFINED / IS NOT DEFINED scenarios
	it('when undefined and IS DEFINED', () => {
		const state = { showEducation: false };
		const statement =
			'WHEN someUndefinedThing.child IS DEFINED THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('hidden');
	});

	it('when undefined and IS NOT DEFINED', () => {
		const state = { showEducation: false };
		const statement =
			'WHEN someUndefinedThing.child IS NOT DEFINED THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('shown');
	});

	it('when defined and IS DEFINED', () => {
		const state = { showEducation: false };
		const statement =
			'WHEN showEducation IS DEFINED THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('shown');
	});

	it('when defined and IS NOT DEFINED', () => {
		const state = { showEducation: false };
		const statement =
			'WHEN showEducation IS NOT DEFINED THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('hidden');
	});

	// GREATER THAN
	describe('Number Comparators', () => {
		describe('GREATERTHAN', () => {
			it('when 150 is GREATER THAN 100', () => {
				const state = { global: { Balance: 150 } };
				const statement =
					'WHEN global_Balance IS GreaterThan(100) THEN flex ELSE none';
				const result = whenRunner(statement, state);
				expect(result).toEqual('flex');
			});

			it('when -50 is GREATER THAN 100', () => {
				const state = { global: { Balance: -50 } };
				const statement =
					'WHEN global_Balance IS gReAthErTHAN(100) THEN flex ELSE none';
				const result = whenRunner(statement, state);
				expect(result).toEqual('none');
			});

			it('when 0 is >NOT< GREATER THAN 0', () => {
				const state = { global: { Balance: 0 } };
				const statement =
					'WHEN global_Balance IS NOT greaterthan(0) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('grey500');
			});

			it('when 1000 is >NOT< GREATER THAN 20', () => {
				const state = { global: { Balance: 1000 } };
				const statement =
					'WHEN global_Balance IS NOT GREATERTHAN(20) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('white100');
			});
		});

		describe('GREATEROREQUALTHAN', () => {
			it('when 99 is GREATER OR EQUAL THAN 99', () => {
				const state = { global: { Balance: 99 } };
				const statement =
					'WHEN global_Balance IS GREATEROREQUALTHAN(99)';
				const result = whenRunner(statement, state);
				expect(result).toEqual(true);
			});

			it('when 10 is GREATER OR EQUAL THAN 5', () => {
				const state = { global: { Balance: 10 } };
				const statement =
					'WHEN global_Balance IS GREATEROREQUALTHAN(5) THEN 1 ELSE 0';
				const result = whenRunner(statement, state);
				expect(result).toEqual('1');
			});

			it('when 10 is GREATER OR EQUAL THAN 500', () => {
				const state = { global: { Balance: 10 } };
				const statement =
					'WHEN global_Balance IS GREATEROREQUALTHAN(500) THEN 1 ELSE 0';
				const result = whenRunner(statement, state);
				expect(result).toEqual('0');
			});

			it('when -5 is >NOT< GREATER OR EQUAL THAN 100', () => {
				const state = { global: { Balance: -5 } };
				const statement =
					'WHEN global_Balance IS NOT GREATEROREQUALTHAN(100)';
				const result = whenRunner(statement, state);
				expect(result).toEqual(true);
			});
		});

		describe('LESS THAN', () => {
			it('when 10 is LESS THAN 15', () => {
				const state = { global: { Balance: 10 } };
				const statement =
					'WHEN global_Balance IS LESSTHAN(15) THEN flex ELSE none';
				const result = whenRunner(statement, state);
				expect(result).toEqual('flex');
			});

			it('when -50 is LESS THAN -100', () => {
				const state = { global: { Balance: -50 } };
				const statement =
					'WHEN global_Balance IS LESSTHAN(-100) THEN flex ELSE none';
				const result = whenRunner(statement, state);
				expect(result).toEqual('none');
			});

			it('when 0 is LESS THAN 0', () => {
				const state = { global: { Balance: 0 } };
				const statement =
					'WHEN global_Balance IS LESSTHAN(0) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('white100');
			});

			it('when 0 is >NOT< LESS THAN 0', () => {
				const state = { global: { Balance: 0 } };
				const statement =
					'WHEN global_Balance IS NOT LESSTHAN(0) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('grey500');
			});

			it('when 100 is >NOT< LESS THAN 50', () => {
				const state = { global: { Balance: 100 } };
				const statement =
					'WHEN global_Balance IS NOT LESSTHAN(50) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('grey500');
			});
		});

		describe('LESS OR EQUAL THAN', () => {
			it('when 10 is LESS OR EQUAL THAN 15', () => {
				const state = { global: { Balance: 10 } };
				const statement =
					'WHEN global_Balance IS LESSOREQUALTHAN(15) THEN flex ELSE none';
				const result = whenRunner(statement, state);
				expect(result).toEqual('flex');
			});

			it('when -0 is LESS OR EQUAL THAN -100', () => {
				const state = { global: { Balance: -50 } };
				const statement =
					'WHEN global_Balance IS LESSOREQUALTHAN(-100) THEN flex ELSE none';
				const result = whenRunner(statement, state);
				expect(result).toEqual('none');
			});

			it('when 0 is LESS OR EQUAL THAN 0', () => {
				const state = { global: { Balance: 0 } };
				const statement =
					'WHEN global_Balance IS LESSOREQUALTHAN(0) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('grey500');
			});

			it('when 0 is >NOT< LESS OR EQUAL THAN 0', () => {
				const state = { global: { Balance: 0 } };
				const statement =
					'WHEN global_Balance IS NOT LESSOREQUALTHAN(0) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('white100');
			});

			it('when 100 is >NOT< LESS OR EQUAL THAN 50', () => {
				const state = { global: { Balance: 100 } };
				const statement =
					'WHEN global_Balance IS NOT LESSOREQUALTHAN(50) THEN grey500 ELSE white100';
				const result = whenRunner(statement, state);
				expect(result).toEqual('grey500');
			});
		});
	});

	//TODO: this should not be failing
	it.skip('when undefined, coerce to false', () => {
		const state = { showEducation: false };
		const statement = 'WHEN someUndefinedThing THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('hidden');
	});
	//TODO: this should not be failing
	it.skip('when undefined child, coerce to false', () => {
		const state = { showEducation: false };
		const statement =
			'WHEN someUndefinedThing.child THEN shown ELSE hidden';
		const result = whenRunner(statement, state);
		expect(result).toEqual('hidden');
	});

	/* even shorter syntax:
		'WHEN x'
		equivalent to
		'WHEN x THEN true ELSE false'
	*/
	it('returns true for showEducation when true (shorter - just boolean)', () => {
		const state = { showEducation: 'TRUE' };
		const statement = 'WHEN showEducation';
		const result = whenRunner(statement, state);
		expect(result).toEqual(true);
	});
	it('returns false for showEducation when false/undefined (shorter - just boolean)', () => {
		const state = { showEducation: 'FALSE' };
		const statement = 'WHEN showEducation';
		const result = whenRunner(statement, state);
		expect(result).toEqual(false);
	});

	it('returns true when using only true', () => {
		const statement = 'WHEN true';
		const result = whenRunner(statement, {});
		expect(result).toEqual(true);
	});
	it('returns false when using only false', () => {
		const statement = 'WHEN false';
		const result = whenRunner(statement, {});
		expect(result).toEqual(false);
	});

	it('returns true as boolean when using then/else with true/false', () => {
		const statement = 'WHEN true IS true THEN true ELSE false';
		const result = whenRunner(statement, {});
		expect(result).toEqual(true);
	});

	it('returns false as boolean when using then/else with true/false', () => {
		const statement = 'WHEN true IS false THEN true ELSE false';
		const result = whenRunner(statement, {});
		expect(result).toEqual(false);
	});

	/* errors */
	it('no WHEN statement', () => {
		const state = { showEducation: true };
		const statement = '';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual(undefined);
	});
	it('WHEN statement missing specifier', () => {
		const state = { showEducation: true };
		const statement = 'WHEN';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual(undefined);
	});

	/* debug helper */
	it('logs everything, successful case', () => {
		const state = { showEducation: 'hello' };
		const statement = 'DEBUG WHEN showEducation';
		const logger = jest.fn();
		whenRunner(statement, state, logger);
		expect(logger).toHaveBeenCalledWith({
			message: 'When runner for: "DEBUG WHEN showEducation" - Parsed',
			dataSources: { showEducation: 'hello' },
			conditions: [{ when: 'showEducation' }],
		});
	});
	it('logs everything, error case', () => {
		const state = { showEducation: 'hello' };
		const statement = 'foo';
		const logger = jest.fn();
		whenRunner(statement, state, logger);
		expect(logger).toHaveBeenCalledWith({
			error: 'When Runner: problem parsing condition "foo"',
			dataSources: state,
		});
	});

	/* nested */
	it('can parse nested state values', () => {
		const state = { nested: { child: true } };
		const statement = 'WHEN nested.child THEN string1 ELSE string2';
		const result = whenRunner(statement, state);
		expect(result).toEqual('string1');
	});
	it('can parse nested state values, with embedded array', () => {
		const state = { nested: { child: [{ value: false }] } };
		const statement =
			'WHEN nested.child.0.value IS 0 THEN string1 ELSE string2';
		const result = whenRunner(statement, state);
		expect(result).toEqual('string1');
	});

	it('supports values with string literals in "" with delimiters', () => {
		const state = {
			childDedsCreateDedMethodSelected: 'hi there',
		};
		const statement =
			'WHEN childDedsCreateDedMethodSelected IS "hi there" THEN flex ELSE none';
		const result = whenRunner(statement, state);
		expect(result).toEqual('flex');
	});
	it("supports values with string literals in '' with delimiters", () => {
		const state = {
			childDedsCreateDedMethodSelected: 'hi there',
		};
		const statement =
			"WHEN childDedsCreateDedMethodSelected IS 'hi there' THEN flex ELSE none";
		const result = whenRunner(statement, state);
		expect(result).toEqual('flex');
	});

	it('support custom suffixes and states', () => {
		const state = {
			global: {
				blue: false,
			},
			row: {
				blue: 'true',
			},
		};
		const statement = 'WHEN row_blue IS true THEN flex ELSE none';
		const result = whenRunner(statement, state);
		expect(result).toEqual('flex');
	});

	it('support nested custom suffixes and states', () => {
		const state = {
			global: {
				favoriteShow: {
					theOffice: false,
				},
			},
			row: {
				favoriteShow: {
					theOffice: {
						sometimes: true,
					},
				},
			},
		};
		const statement =
			"WHEN row_favoriteShow.theOffice.sometimes IS true THEN 'it is your birthday' ELSE 'keep quiet'";
		const result = whenRunner(statement, state);
		expect(result).toEqual('it is your birthday');
	});

	//Consider global_test2 as a solution
	it('supports values with property names', () => {
		const state = {
			global: {
				test1: '1',
				test2: '1',
			},
			row: {
				status: '1',
			},
		};
		// const statement = 'WHEN global_test1 IS row_status'; // shall return true
		const statement = 'WHEN global_test1 IS global_test2';
		const result = whenRunner(statement, state);
		expect(result).toEqual(true);
	});

	it('coerces to true', () => {
		const state = {
			global: {
				boolFalse: false,
				emptyString: '',
				undefinedValue: undefined,
				nullValue: null,
				zero: 0,
				emptyObject: {},

				boolTrue: true,
				numberValue: 1234,
				stringValue: 'I am a valid string!',
				emptyArr: [],
				nonEmptyObj: { a: 1, b: 2 },
				nonEmptyArr: [{ c: 3 }],
			},
		};

		// prettier-ignore
		const statements = [
			{ condition: 'WHEN global_boolFalse     THEN inline-flex ELSE none', expected: 'none'  },
			{ condition: 'WHEN global_emptyString   THEN inline-flex ELSE none', expected: 'none'  },
			{ condition: 'WHEN global_undefinedValue THEN inline-flex ELSE none', expected: 'none'  },
			{ condition: 'WHEN global_nullValue     THEN inline-flex ELSE none', expected: 'none'  },
			{ condition: 'WHEN global_zero          THEN inline-flex ELSE none', expected: 'none'  },
			{ condition: 'WHEN global_emptyObj      THEN inline-flex ELSE none', expected: 'none'  },

			{ condition: 'WHEN global_boolTrue    THEN inline-flex ELSE none', expected: 'inline-flex'  },
			{ condition: 'WHEN global_numberValue THEN inline-flex ELSE none', expected: 'inline-flex'  },
			{ condition: 'WHEN global_stringValue THEN inline-flex ELSE none', expected: 'inline-flex'  },
			{ condition: 'WHEN global_nonEmptyObj THEN inline-flex ELSE none', expected: 'inline-flex'  },
			{ condition: 'WHEN global_nonEmptyArr THEN inline-flex ELSE none', expected: 'inline-flex'  },
		]

		statements.forEach((x) => {
			const result = whenRunner(x.condition, state);
			expect(result).toEqual(x.expected);
		});
	});

	it('supports values with source_value pattern', () => {
		const state = {
			global: {
				a: '1',
				b: '2',
			},
			row: {
				a: '3',
			},
		};
		const wExpect = (statement, expected) =>
			expect(whenRunner(statement, state)).toEqual(expected);

		wExpect('WHEN global_a IS "foo" THEN "bar" ELSE "baz"', 'baz');
		wExpect('WHEN global_a IS row_a THEN "bar" ELSE "bear"', 'bear');
		wExpect('WHEN row_b IS undefined THEN global_a ELSE global_b', '1');
		wExpect('WHEN global_a IS global_a THEN global_a ELSE row_a', '1');
		wExpect('WHEN global_a IS global_b THEN global_a ELSE row_a', '3');
		wExpect('WHEN row_editing IS undefined THEN block ELSE none', 'block');
	});

	it('supports values with source_value pattern', () => {
		const state = {
			global: {
				a: '1',
				b: '2',
				array: [{ a: '1', b: '2' }],
			},
		};
		const wExpect = (statement, expected) =>
			expect(whenRunner(statement, state)).toEqual(expected);

		wExpect(
			'WHEN global_array.0.a IS 1 AND global_array.0.b IS 2 THEN ok ELSE no',
			'ok',
		);
	});

	it('supports AND/OR and IS NOT', () => {
		const state = {
			global: {
				a: '1',
				b: '2',
			},
			row: {
				a: '3',
			},
		};
		const wExpect = (statement, expected) =>
			expect(whenRunner(statement, state)).toEqual(expected);

		//AND
		wExpect('WHEN global_a IS 1 AND global_b IS 2 THEN ok ELSE no', 'ok');
		wExpect('WHEN false AND true THEN ok ELSE no', 'no');
		wExpect('WHEN true AND true THEN ok ELSE no', 'ok');
		//OR
		wExpect('WHEN false OR true IS true THEN ok ELSE no', 'ok');
		wExpect('WHEN false OR true IS false THEN ok ELSE no', 'no');
		//IS NOT
		wExpect('WHEN true IS NOT false THEN ok ELSE no', 'ok');
		wExpect('WHEN true IS NOT true THEN ok ELSE no', 'no');

		//AND + IS + IS NOT
		wExpect(
			'WHEN true IS true AND true IS NOT false THEN ok ELSE no',
			'ok',
		);
		wExpect(
			'WHEN true IS NOT true AND true IS NOT false THEN ok ELSE no',
			'no',
		);

		//OR + IS + IS NOT
		wExpect('WHEN true IS true OR true IS NOT true THEN ok ELSE no', 'ok');
		wExpect(
			'WHEN true IS NOT true OR true IS NOT false THEN ok ELSE no',
			'ok',
		);
	});

	it('breaks when mixing AND/OR', () => {
		const state = {
			global: {
				a: '1',
				b: '2',
			},
			row: {
				a: '3',
			},
		};
		const statement =
			'DEBUG WHEN global_a IS 1 AND global_b IS 2 OR global_c IS 3 THEN that ELSE this';

		const logger = jest.fn();
		expect(whenRunner(statement, state, logger)).toEqual(undefined);

		expect(logger).toHaveBeenCalledTimes(2);
		expect(logger).toHaveBeenNthCalledWith(
			1,
			'whenParser: using AND/OR altogether. We do not support mixed AND/OR',
		);

		expect(logger).toHaveBeenLastCalledWith({
			dataSources: state,
			error: 'When Runner: problem parsing condition "DEBUG WHEN global_a IS 1 AND global_b IS 2 OR global_c IS 3 THEN that ELSE this"',
		});
	});
});

describe('when: using empty quotes / expecting empty or not empty values', () => {
	it('expects empty to be empty', () => {
		const state = { EmployeeName: '' };
		const statement = 'WHEN EmployeeName IS ""';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual(true);
	});

	it('expects empty to be empty - with THEN/ELSE', () => {
		const state = { EmployeeName: '' };
		const statement = 'WHEN EmployeeName IS "" THEN 1 ELSE 2';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual('1');
	});

	it('expects empty TO NOT BE empty', () => {
		const state = { EmployeeName: '' };
		const statement = 'WHEN EmployeeName IS NOT ""';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual(false);
	});

	it('expects empty TO NOT BE empty - with THEN/ELSE', () => {
		const state = { EmployeeName: '' };
		const statement = 'WHEN EmployeeName IS NOT "" THEN 1 ELSE 2';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual('2');
	});

	it('expects not empty to be empty', () => {
		const state = { EmployeeName: 'I am not empty' };
		const statement = 'WHEN EmployeeName IS ""';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual(false);
	});

	it('expects not empty TO NOT BE empty', () => {
		const state = { EmployeeName: 'I am not empty' };
		const statement = 'WHEN EmployeeName IS NOT ""';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);
		expect(result).toEqual(true);
	});
});

describe('when: with roles functions', () => {
	beforeAll(() => {
		StateManager.init({
			rolesMap: {
				1: { key: 'AAA1', isParent: 1 },
				2: { key: 'BBB2', isParent: 0 },
				3: { key: 'CCC3', isParent: 1 },
				4: { key: 'DDD4', isParent: 0 },
				5: { key: 'EEE5', isParent: 1 },
				6: { key: 'FFF6', isParent: 0 },
			},
		});
	});

	beforeEach(() => {
		Object.defineProperty(document, 'cookie', {
			writable: true,
			value: 'CURRENTBRANCH=1',
		});
	});

	it.todo(
		'if current branch changes, do we trigger a re-render?  are we listening to localStorage/how? is this necessary?',
	);

	it('HASROLES - user has role', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 3, branchId: 3 }],
				},
			},
		};
		const statement =
			'DEBUG WHEN HASROLES(CCC3,BBB1) THEN shown ELSE hidden';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);

		expect(logger).toHaveBeenCalledWith({
			message:
				'When runner for: "DEBUG WHEN HASROLES(CCC3,BBB1) THEN shown ELSE hidden" - Parsed',
			dataSources: state,
			conditions: [{ when: 'HASROLES(CCC3,BBB1)' }],
		});

		expect(result).toEqual('shown');
	});

	it('HASROLES - user has roles in multiple branches', () => {
		const state = {
			global: {
				currentUser: {
					roles: [
						{ roleId: 3, branchId: 'Scranton Branch' },
						{ roleId: 4, branchId: 'Syracuse Branch' },
						{ roleId: 3, branchId: 'New York Corp. Branch' },
						{ roleId: 4, branchId: 'New York Corp. Branch' },
						{ roleId: 3, branchId: 'Vermont Branch' },
						{ roleId: 4, branchId: 'Vermont Branch' },
					],
				},
			},
		};
		const statement = 'DEBUG WHEN HASROLES(DDD4)';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);

		expect(logger).toHaveBeenCalledWith({
			message: 'When runner for: "DEBUG WHEN HASROLES(DDD4)" - Parsed',
			dataSources: state,
			conditions: [{ when: 'HASROLES(DDD4)' }],
		});

		expect(result).toEqual(true);
	});

	it('HASROLES - user does not have role', () => {
		const state = {
			global: {
				currentUser: {
					roles: [
						{ roleId: 1, branchId: 1 },
						{ roleId: 2, branchId: 1 },
						{ roleId: 4, branchId: 1 },
						{ roleId: 5, branchId: 1 },
						{ roleId: 6, branchId: 1 },
					],
				},
			},
		};
		const statement = 'WHEN HASROLES(CCC3) THEN shown ELSE hidden';
		const result = whenRunner(statement, state);

		expect(result).toEqual('hidden');
	});

	it('HASROLES - currentUser.roles is empty', () => {
		const state = {
			global: {
				currentUser: {
					roles: [],
				},
			},
		};
		const statement = 'WHEN HASROLES(AAA1) THEN shown ELSE hidden';
		const result = whenRunner(statement, state);

		expect(result).toEqual('hidden');
	});

	it('HASROLES - only with role function, without THEN/ELSE', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 1, branchId: 1 }],
				},
			},
		};
		const statement = 'WHEN HASROLES(AAA1)';
		const result = whenRunner(statement, state);

		expect(result).toEqual(true);
	});

	it('HASROLES - only with role function, without THEN/ELSE - inversed/negative case', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 1, branchId: 1 }],
				},
			},
		};
		const statement = 'WHEN HASROLES(BBB2)';
		const result = whenRunner(statement, state);

		expect(result).toEqual(false);
	});

	it('HASROLES: syntax errors, ie HASROLES(AAA1,BBB2]', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 1, branchId: 3, RoleName: 'Manager' }],
				},
			},
		};
		const statement =
			'DEBUG WHEN HASROLES(AAA1,BBB2] THEN shown ELSE hidden';
		const logger = jest.fn();
		const result = whenRunner(statement, state, logger);

		expect(result).toEqual('hidden');
	});

	it('HASBRANCHROLES - user has roles, but not in right branch', () => {
		const state = {
			global: {
				currentUser: {
					roles: [
						{ roleId: 3, branchId: 900 },
						{ roleId: 2, branchId: 900 },
						{ roleId: 1, branchId: 900 },
					],
				},
			},
		};

		// although user has all 3 expected roles, none of them is in the expected branch, which is "1"
		const statement = 'WHEN HASBRANCHROLES(AAA1,BBB2,CCC3)';
		const result = whenRunner(statement, state);

		expect(result).toEqual(false);
	});

	it('HASBRANCHROLES - correct case', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 3, branchId: 1 }],
				},
			},
		};

		const statement = 'WHEN HASBRANCHROLES(AAA1,BBB2,CCC3)';
		const result = whenRunner(statement, state);

		expect(result).toEqual(true);
	});

	it.todo('HASBRANCHROLES: syntax errors, ie HASROLES(Manager;Employer]');

	it('ISPARENTATBRANCH - user has parent role, but not in current branch', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 1, branchId: 3000 }],
				},
			},
		};
		const statement = 'DEBUG WHEN ISPARENTATBRANCH';
		const result = whenRunner(statement, state);

		expect(result).toEqual(false);
	});

	it('ISPARENTATBRANCH - has parent role on correct branch', () => {
		const state = {
			global: {
				currentUser: {
					roles: [{ roleId: 1, branchId: 1 }],
				},
			},
		};
		const statement = 'DEBUG WHEN ISPARENTATBRANCH';
		const result = whenRunner(statement, state);

		expect(result).toEqual(true);
	});

	it('ISPARENTATBRANCH - has parent role on multiple branches', () => {
		const state = {
			global: {
				currentUser: {
					roles: [
						{ roleId: 1, branchId: 1 },
						{ roleId: 1, branchId: 2 },
						{ roleId: 1, branchId: 3 },
						{ roleId: 1, branchId: 4 },
					],
				},
			},
		};
		const statement = 'DEBUG WHEN ISPARENTATBRANCH';
		const result = whenRunner(statement, state);

		expect(result).toEqual(true);
	});
});
