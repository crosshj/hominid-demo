import { StateManager } from '../../../../state/state';
import { Input_Props_1 } from '../shims/fixtures';
import { fill } from './fillStatefulProps';
import { fillStatefulPropsData1 } from './fixtures/fillStatefulProps_data1';
import { fillStatefulPropsData2 } from './fixtures/fillStatefulProps_data2';

const exampleState1 = {
	optionsExample2: [
		{
			label: 'Option 1',
			value: 1,
		},
		{
			label: 'Option 2',
			value: 2,
		},
		{
			label: 'Option 3',
			value: 3,
		},
		{
			label: 'Option 4',
			value: 4,
		},
		{
			label: 'Option 5',
			value: 5,
		},
	],
	listOfOptionsList: [
		[
			{
				label: 'Option 1',
				value: 1,
			},
			{
				label: 'Option 2',
				value: 2,
			},
		],
	],
	inputTestData1: [
		{
			datetime: '2019-05-24T19:30',
			someText: 'violet',
			evenMoreText: 'CHAN',
		},
	],
	childHomeOrders: [
		{
			JobOrderID: 'JOB_ORDER_ID',
			orderName: 'ORDER_NAME',
		},
	],
	nullableValue: null,
	selectedAssignment: 1,
	clientChildCreateJobSiteContacts: [{ checked: false }, { checked: true }],
	version: 0,
};

describe('fill', () => {
	describe('global state', () => {
		beforeAll(() => {
			StateManager.init(exampleState1);
		});

		it('should fill stateful props with values from global state and row', () => {
			const statefulProps = {
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
				},
				crazyProp: {
					tokens: [
						{
							key: 'crazyProp',
							match: 'global_nullableValue',
							source: 'global',
							path: 'nullableValue',
							formatter: undefined,
						},
					],
					originalValue: 'global_nullableValue',
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
				},
				some_date: {
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
				},
				textContent: {
					tokens: [
						{
							key: 'textContent',
							match: '{{row_someText}}',
							source: 'row',
							path: 'someText',
						},
						{
							key: 'textContent',
							match: '{{row_evenMoreText}}',
							source: 'row',
							path: 'evenMoreText',
						},
					],
					originalValue: '{{row_someText}}-{{row_evenMoreText}}',
				},
			};

			const propsFilled = fill(Input_Props_1.propsIntact, statefulProps);

			// replaced with global values
			expect(propsFilled).toEqual({
				some_date: '2019-05-24T19:30',
				textContent: 'violet-CHAN',
				value: 1,
				crazyProp: null,
				options: [
					{
						label: 'Option 1',
						value: 1,
					},
					{
						label: 'Option 2',
						value: 2,
					},
					{
						label: 'Option 3',
						value: 3,
					},
					{
						label: 'Option 4',
						value: 4,
					},
					{
						label: 'Option 5',
						value: 5,
					},
				],
			});
		});

		it('should handle list of options list (used by row option lists)', () => {
			const statefulProps = {
				rowCellOptions: {
					tokens: [
						{
							key: 'rowCellOptions',
							match: 'global_listOfOptionsList[0]',
							source: 'global',
							path: 'listOfOptionsList[0]',
						},
					],
					pathsToListen: ['listOfOptionsList[0]'],
					originalValue: 'global_listOfOptionsList[row_index]',
				},
			};
			const propsIntact = {
				rowCellOptions: 'global_listOfOptionsList[row_index]',
				__rowIndex: 0,
				__rowStateKey: 'inputTestData1',
			};

			const propsFilled = fill(propsIntact, statefulProps);

			// replaced with global values
			expect(propsFilled).toEqual({
				rowCellOptions: exampleState1.listOfOptionsList[0],
			});
		});

		it('situation: fillStateProps.data1', () => {
			const { propsIntact, statefulProps } = fillStatefulPropsData1;
			const propsFilled = fill(propsIntact, statefulProps);
			expect(propsFilled.checked).toBe(true);
		});

		it('situation: fillStateProps.data2', () => {
			const { propsIntact, statefulProps } = fillStatefulPropsData2;
			const propsFilled = fill(propsIntact, statefulProps);
			expect(propsFilled.href).toBe(
				'/jobOrdersChildDetails/JOB_ORDER_ID',
			);
		});
	});
});
