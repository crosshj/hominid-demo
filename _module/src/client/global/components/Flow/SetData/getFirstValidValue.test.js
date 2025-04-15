const { getFirstValidValue } = require('./getFirstValidValue');

describe('getFirstValidValue', () => {
	describe('should return first valid value based on order of provided dataPaths', () => {
		it('with global using index', () => {
			const sources = {
				flowArgs: {},
				global: {
					myArray: [10, 100, 1000],
				},
			};

			const dataPaths = 'global_myArray[2]';

			const value = getFirstValidValue(dataPaths, sources);

			expect(value).toBe('1000');
		});

		it('with two paths - global and flowArgs', () => {
			const sources = {
				flowArgs: {
					index: 1000,
				},
				global: {
					basic: '9999',
				},
			};

			const dataPaths = 'global_basic, flowArgs.index';

			const value = getFirstValidValue(dataPaths, sources);

			// first it gets "global_basic"
			expect(value).toBe('9999');

			delete sources.global.basic;
			expect(sources.global).toEqual({});

			const newValue = getFirstValidValue(dataPaths, sources);

			expect(newValue).toBe('1000');
		});

		it('with two paths -  global and flowArgs - INVERSED', () => {
			const sources = {
				flowArgs: {
					index: 1000,
				},
				global: {
					basic: '9999',
				},
			};

			const dataPaths = 'flowArgs.index, global_basic';

			const value = getFirstValidValue(dataPaths, sources);

			// first it gets "global_basic"
			expect(value).toBe('1000');

			delete sources.flowArgs.index;
			expect(sources.flowArgs).toEqual({});

			const newValue = getFirstValidValue(dataPaths, sources);

			expect(newValue).toBe('9999');
		});

		it('with two paths - global and static text', () => {
			const sources = {
				global: {},
			};

			const dataPaths =
				'global_myProperty, static_myDefaultValueIsABigText';

			const value = getFirstValidValue(dataPaths, sources);

			// gets value from static
			expect(value).toBe('myDefaultValueIsABigText');
		});

		it('with two paths - global and static null', () => {
			const sources = {
				global: {},
			};

			const dataPaths = 'global_myProperty, static_null';

			const value = getFirstValidValue(dataPaths, sources);

			// gets value from static
			expect(value).toBe(null);
		});

		it('with one path and formatter', () => {
			const sources = {
				global: {
					myBeautifulNumber: '77777',
				},
			};

			const dataPaths = 'global_myBeautifulNumber:number';

			const value = getFirstValidValue(dataPaths, sources);

			expect(value).toBe(77777);
		});

		it('with one path and value is an array', () => {
			const sources = {
				global: { myArray: ['123'] },
			};

			const dataPaths = 'global_myArray';

			const value = getFirstValidValue(dataPaths, sources);

			expect(value).toEqual(['123']);
		});

		it('with one path and value is an array with "join"formatter', () => {
			const sources = {
				global: { myArray: ['11', '44', '55'] },
			};

			const dataPaths = 'global_myArray:join';

			const value = getFirstValidValue(dataPaths, sources);

			expect(value).toBe('114455');
		});

		it('with one path and undefined flowArgs', () => {
			const sources = {
				flowArgs: undefined,
			};

			const dataPath = 'flowArgs';

			const value = getFirstValidValue(dataPath, sources);

			expect(value).toBe(undefined);
		});

		it('with one path and empty flowArgs', () => {
			const sources = {
				flowArgs: {},
			};

			const dataPath = 'flowArgs';

			const value = getFirstValidValue(dataPath, sources);

			expect(value).toEqual({});
		});

		it('with one path and flowArgs', () => {
			const sources = {
				flowArgs: {
					CompanyAddress: 'Lala Ln.',
					CompanyName: 'My Old Company',
					CompanyPhone: '237-747-3874',
					EndDate: '2023-10-01T00:00:00.000Z',
					EndingSallary: 40000,
					LeavingReason: 'Got bored ',
					Position: 'Worker',
					Responsabilities: 'do stuff',
					StartDate: '2023-08-01T00:00:00.000Z',
					TalentID: 16,
					Title: 'Worker Supreme',
					id: 1,
					index: 0,
					isActive: true,
				},
			};
			const dataPath = 'flowArgs';

			const value = getFirstValidValue(dataPath, sources);

			expect(value).toEqual({
				CompanyAddress: 'Lala Ln.',
				CompanyName: 'My Old Company',
				CompanyPhone: '237-747-3874',
				EndDate: '2023-10-01T00:00:00.000Z',
				EndingSallary: 40000,
				LeavingReason: 'Got bored ',
				Position: 'Worker',
				Responsabilities: 'do stuff',
				StartDate: '2023-08-01T00:00:00.000Z',
				TalentID: 16,
				Title: 'Worker Supreme',
				id: 1,
				index: 0,
				isActive: true,
			});
		});

		it('with two paths and formatter - global and static', () => {
			const sources = {
				global: {},
			};

			const dataPathsWithNumberFormatter =
				'global_myProperty, static_9999:number';

			const value = getFirstValidValue(
				dataPathsWithNumberFormatter,
				sources,
			);

			expect(value).toBe(9999);

			const dataPathsWithoutFormatter = 'global_myProperty, static_9999';

			const valueWithoutFormatter = getFirstValidValue(
				dataPathsWithoutFormatter,
				sources,
			);

			expect(valueWithoutFormatter).toBe('9999');
		});

		it('with two paths and formatter - global and flowArgs', () => {
			const sources = {
				flowArgs: {
					song: '{"prop":"myNameIs...","slimShady":true}',
				},
				global: {
					basic: '9999',
				},
			};

			const dataPaths = 'flowArgs.song:object, global_basic:number';

			const value = getFirstValidValue(dataPaths, sources);

			expect(value).toEqual({ prop: 'myNameIs...', slimShady: true });
		});
	});
});
