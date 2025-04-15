const { StateManager } = require('../../../../state/state');
const { SetData } = require('.');

const onStepBuilder = () => {
	let stepPromiseResolver;
	const stepPromise = new Promise((res) => {
		stepPromiseResolver = res;
	});

	return [stepPromise, jest.fn(stepPromiseResolver)];
};

xdescribe('SetData', () => {
	describe('simple scenarios', () => {
		it('should update with number value from data', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'data1',
				data: 100,
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('data1')).toBe(args.data);
		});

		it('should update with object value from data', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'data1',
				data: { prop1: 'aaa', prop5: 15 },
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('data1')).toEqual(args.data);
		});

		it('should set to empty', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'whatAboutThis',
				data: '',
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('whatAboutThis')).toEqual(args.data);
		});
	});

	describe('multiple data paths', () => {
		beforeEach(() => {
			StateManager.init({
				version: 0,
				nullableValue: null,
			});
		});

		it('should use 1st value if 1st value is null', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'ooooPath',
				data: 'global_nullableValue, static_123123',
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('ooooPath')).toBe('null');
		});

		it('should only use 2nd value if 1st value is undefined - global_', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'nullableValue',
				data: 'global_ThisvalueDoesNotExist[flowArgs.index].id, static_null',
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('nullableValue')).toBe(null);
		});

		it('should only use 2nd value if 1st value is undefined - results', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'multipleNumbers',
				data: 'results.0, static_888888888',
				onStep: onStepMock,
				results: [999, 123, 555, 777],
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('multipleNumbers')).toBe('999');
		});

		it('should only use 2nd value if 1st value is undefined - flowArgs', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'multipleNumbers',
				data: 'flowArgs.myID, static_null',
				onStep: onStepMock,
				flowArgs: {
					myID: undefined,
				},
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('multipleNumbers')).toBe(null);
		});
	});

	describe('global', () => {
		beforeEach(() => {
			StateManager.init({
				version: 0,
				simpleIndex: 3,
				optionsList: [{ id: 1 }, { id: 2 }, { id: 3 }],
			});
		});

		it('should update with mixed value from global and flowArgs', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'selectedOptionId',
				data: 'global_optionsList[flowArgs.index].id',
				flowArgs: {
					index: 2,
				},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('selectedOptionId')).toBe('3');
		});
	});

	describe('stepArgs', () => {
		it('should update with whole stepArgs', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'global_bigObject',
				data: 'stepArgs',
				stepArgs: {
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
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('bigObject')).toEqual(args.stepArgs);
		});

		it('should update with stepArgs with property', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'myTest',
				data: 'flowArgs.newValue',
				flowArgs: {
					newValue: 'green',
				},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get(args.name)).toBe(args.flowArgs.newValue);
		});

		it('should update with flowArgs - coming from SUBSCRIBE, with PATH', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'myTest',
				data: 'flowArgs.newValue',
				flowArgs: {
					path: 'selectedClient',
					newValue: '15',
				},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get(args.name)).toBe(args.flowArgs.newValue);
		});
	});

	describe('results', () => {
		it('should update with value that comes from results - with brackets', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'withBrackets',
				data: 'results[0]',
				flowArgs: {},
				results: [{ myID: '1' }, { myID: '2' }, { myID: '3' }],
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get(args.name)).toEqual(args.results[0]);
		});

		it('should update with value that comes from results - with brackets (2)', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'withBracketsAndKey',
				data: 'results[2].myID',
				flowArgs: {},
				results: [{ myID: '1' }, { myID: '25555' }, { myID: '3' }],
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get(args.name)).toBe(args.results[2].myID);
		});

		it('should update with value that comes from results - with lodash notation', async () => {
			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'myTest',
				data: 'results.0.myProp',
				flowArgs: {},
				results: [
					{
						myProp: '123456',
					},
				],
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get(args.name)).toBe(args.results[0].myProp);
		});
	});

	describe('mutate', () => {
		beforeEach(() => {
			StateManager.init({
				mutateMockedData: 1,
				version: 0,
			});
		});

		it('should add 5', async () => {
			expect(StateManager.get('mutateMockedData')).toBe(1);

			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'mutateMockedData',
				mutate: 'add:5',
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('mutateMockedData')).toBe(6);
		});

		it('should try to add 100, but "max" stops it', async () => {
			expect(StateManager.get('mutateMockedData')).toBe(1);

			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'mutateMockedData',
				mutate: 'add:100,max:50',
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('mutateMockedData')).toBe(50);
		});

		it('should try to subtract 100, but "min" prop stops it', async () => {
			expect(StateManager.get('mutateMockedData')).toBe(1);

			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'mutateMockedData',
				mutate: 'subtract:100,min:-20',
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('mutateMockedData')).toBe(-20);
		});

		it('should add 5, then subtract 5', async () => {
			expect(StateManager.get('mutateMockedData')).toBe(1);

			const [stepPromise, onStepMock] = onStepBuilder();

			const args = {
				name: 'mutateMockedData',
				mutate: 'add:5,subtract:5',
				flowArgs: {},
				onStep: onStepMock,
			};

			SetData(args);

			await stepPromise;

			expect(StateManager.get('mutateMockedData')).toBe(1);
		});
	});
});
