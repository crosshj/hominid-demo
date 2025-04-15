describe('disabled', () => {
	it('disabled', () => {});
});

// import { render, waitFor } from '@testing-library/react';

// import { Query } from './index.test.js';

// import { useFlow } from '../../../hooks/useFlow.js';
// import { useGlobal } from '../../../hooks/useGlobal.js';
// jest.mock('../../../hooks/useFlow.js');
// jest.mock('../../../hooks/useGlobal.js');
// jest.mock('../../../services/submitFormData/index.js');

// const FLOWID = 'flowName';

// const setState = jest.fn();
// const submit = jest.fn();

// const mockUseGlobal = (state = {}) => {
// 	useGlobal.mockImplementation(() => {
// 		return {
// 			state,
// 			setState,
// 			dispatch: jest.fn(),
// 		};
// 	});
// };
// const mockUseFlow = (mockedResult = []) => {
// 	submit.mockReturnValue(Promise.resolve(mockedResult));
// 	useFlow.mockImplementation(() => {
// 		return {
// 			submit,
// 		};
// 	});
// };

// xdescribe('Tests Query component', () => {
// 	beforeEach(() => {
// 		mockUseFlow();
// 		mockUseGlobal();
// 	});
// 	xit('should not call submit without proc', () => {
// 		render(<Query />);
// 		expect(submit).not.toHaveBeenCalled();
// 	});
// 	it('should call a proc with static args', () => {
// 		render(<Query proc="generalProc" procArgs="procKey" />);

// 		expect(submit).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				name: 'generalProc',
// 				params: { key: 'procKey' },
// 			}),
// 		);
// 	});
// 	it('should call a proc with dynamic args read from global', () => {
// 		const mockedParamValues = {
// 			DataName1: 'test',
// 		};
// 		mockUseGlobal(mockedParamValues);
// 		render(
// 			<Query proc="generalProc" param_dbArgName1="global_DataName1" />,
// 		);

// 		expect(submit).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				name: 'generalProc',
// 				params: {
// 					dbArgName1: mockedParamValues.DataName1,
// 				},
// 			}),
// 		);
// 	});
// 	it('should call a proc with dynamic nested args read from global', () => {
// 		const mockedParamValues = {
// 			DataName1: { id: 'test' },
// 		};
// 		mockUseGlobal(mockedParamValues);
// 		render(
// 			<Query proc="generalProc" param_dbArgName1="global_DataName1.id" />,
// 		);

// 		expect(submit).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				name: 'generalProc',
// 				params: {
// 					dbArgName1: mockedParamValues.DataName1.id,
// 				},
// 			}),
// 		);
// 	});

// 	it('should call a proc with undefined on param if global value is not set', () => {
// 		mockUseGlobal();
// 		render(
// 			<Query proc="generalProc" param_dbArgName1="global_DataName1" />,
// 		);

// 		expect(submit).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				name: 'generalProc',
// 				params: {
// 					dbArgName1: undefined,
// 				},
// 			}),
// 		);
// 	});

// 	xit('should use proc result as output for global state', async () => {
// 		useFlow.mockClear();
// 		const mockedResult = [{ results: 'value' }];
// 		mockUseFlow(mockedResult);
// 		render(<Query proc="generalProc" out_currentItem="results" />);

// 		await waitFor(() =>
// 			expect(setState).toHaveBeenCalledWith(
// 				expect.objectContaining({
// 					currentItem: mockedResult[0].results,
// 				}),
// 			),
// 		);
// 	});
// 	xit('should use proc nested result as output for global state', async () => {
// 		useFlow.mockClear();
// 		const mockedResult = [{ results: [{ name: 'random_name' }] }];
// 		mockUseFlow(mockedResult);
// 		render(<Query proc="generalProc" out_currentItem="results[0].name" />);

// 		await waitFor(() =>
// 			expect(setState).toHaveBeenCalledWith(
// 				expect.objectContaining({
// 					currentItem: mockedResult[0].results[0].name,
// 				}),
// 			),
// 		);
// 	});
// 	xit('should use proc result as output for nested global state', async () => {
// 		useFlow.mockClear();
// 		const mockedResult = [{ results: [{ name: 'random_name' }] }];
// 		mockUseFlow(mockedResult);
// 		render(
// 			<Query
// 				proc="generalProc"
// 				out_currentItem_innerKey="results[0].name"
// 			/>,
// 		);

// 		await waitFor(() =>
// 			expect(setState).toHaveBeenCalledWith(
// 				expect.objectContaining({
// 					currentItem: { innerKey: mockedResult[0].results[0].name },
// 				}),
// 			),
// 		);
// 	});
// });
