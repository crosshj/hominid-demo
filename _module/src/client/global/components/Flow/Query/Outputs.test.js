const { StateManager } = require('../../../../state/state');
const QueryOutputs = require('./Outputs');

describe('Query.Outputs', () => {
	beforeEach(() => {
		StateManager.init({
			version: 1,
		});
	});

	it('should process output params and update state based on provided data sources', () => {
		const results = {
			myID: 1000,
			firstName: 'lyon',
		};

		const queryProps = {
			out_addedFirstName: 'results.firstName',
			out_addedID: 'results.myID',
			param_shouldBeSkipped: 'a',
			shouldAlsoBeIgnored: 99,
		};

		QueryOutputs.handleProps(queryProps, results);

		const state = StateManager.get();

		expect(state).toEqual({
			addedFirstName: 'lyon',
			addedID: 1000,

			version: 3,
		});
	});

	it('should process output params and update state based on provided data sources (2)', () => {
		const results = {
			dummy_name_for_results: {
				randomLetters: 'aaaaaaabbbbbbb',
			},
			anotherDataSource: {
				powerLevel: 8001,
				label: "It's more than 8 thousand!",
			},
		};

		const queryProps = {
			out_randomLetters: 'results.dummy_name_for_results.randomLetters',
			out_pwLevel: 'results.anotherDataSource.powerLevel',
			out_label: 'results.anotherDataSource.label',

			param_shouldBeSkipped: 'a',
			shouldAlsoBeIgnored: 99,
		};

		QueryOutputs.handleProps(queryProps, results);

		const state = StateManager.get();

		expect(state).toEqual({
			randomLetters: 'aaaaaaabbbbbbb',
			pwLevel: 8001,
			label: "It's more than 8 thousand!",

			version: 4,
		});
	});
});
