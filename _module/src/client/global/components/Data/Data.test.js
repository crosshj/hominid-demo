describe('disabled', () => {
	it('disabled', () => {});
});

// import '@testing-library/jest-dom/extend-expect';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// import { useGlobal, useData } from '../../hooks';
// import { enhanceArgs } from './enhanceArgs';
// import { Data } from '.';
// import { Input } from '../Input';

// const { useGlobal: actualGlobal } = jest.requireActual(
// 	'global/hooks/useGlobal.js',
// );

// jest.mock('global/hooks/useGlobal.js');
// jest.mock('global/services/getData');

// const setState = jest.fn();
// const mockUseGlobal = (state = {}) => {
// 	useGlobal.mockImplementation(() => {
// 		return {
// 			state,
// 			setState,
// 			dispatch: jest.fn(),
// 		};
// 	});
// };
// const realUseGlobal = () => useGlobal.mockImplementation(actualGlobal);

// xdescribe('how data component interacts', () => {
// 	beforeEach(() => {
// 		realUseGlobal();
// 	});
// 	it('works with inputs and default values using data-name prop', async () => {
// 		render(
// 			<TestProvider>
// 				<Data name="store" defaultValue="{'input1':'foo'}" />
// 				<Input useData="store" data-name="input1" />
// 			</TestProvider>,
// 		);
// 		const selected = screen.getByRole('textbox').value;
// 		expect(selected).toEqual('foo');
// 	});
// 	it('works with inputs and default values using data-name prop test', async () => {
// 		const Display = () => {
// 			const { Component, dataName, ...rest } = FormInputAdapter({
// 				props: {
// 					useData: 'store',
// 				},
// 			});
// 			return <Component {...rest} />;
// 		};
// 		render(
// 			<TestProvider>
// 				<Data name="store" defaultValue="{'input1':'foo'}" />
// 				<Display />
// 			</TestProvider>,
// 		);
// 		const selected = screen.getByRole('textbox').value;
// 		expect(selected).toEqual('foo');
// 	});
// 	it('works with inputs and default values using dot notation', async () => {
// 		render(
// 			<TestProvider>
// 				<Data name="store" defaultValue="{'input1':'foo'}" />
// 				<Input useData="store.input1" />
// 			</TestProvider>,
// 		);
// 		const selected = screen.getByRole('textbox').value;
// 		expect(selected).toEqual('foo');
// 	});
// });

// xdescribe('tests data component', () => {
// 	beforeEach(() => {
// 		mockUseGlobal();
// 	});
// 	it('works without args', async () => {
// 		render(<Data />);
// 		await waitFor(() => expect(setState).not.toHaveBeenCalled());
// 	});
// 	it('sets a defaultValue, no dependancy', async () => {
// 		render(<Data name="foo" defaultValue="2" />);
// 		expect(setState).toHaveBeenCalledWith({ foo: 2 });
// 	});

// 	it('proc is required, not procName', async () => {
// 		render(
// 			<>
// 				<Data name="dataName" proc="fakeProc" />
// 				<Data name="dataName2" procName="fakeProc2" />
// 			</>,
// 		);
// 		expect(getData).toHaveBeenCalledTimes(1);
// 		expect(getData).toHaveBeenCalledWith(
// 			'fakeProc',
// 			expect.any(Object),
// 			expect.any(Function),
// 			'dataName',
// 		);
// 		expect(getData).not.toHaveBeenCalledWith(
// 			'fakeProc2',
// 			expect.any(Object),
// 			expect.any(Function),
// 			'dataName2',
// 		);
// 	});

// 	it('handles multiple params', async () => {
// 		const mockedState = {
// 			varA: 1,
// 			varB: 2,
// 			varC: 3,
// 		};
// 		mockUseGlobal(mockedState);
// 		render(
// 			<Data name="dataName" proc="fakeProc" params="varA&varB&varC" />,
// 		);
// 		expect(getData).toHaveBeenCalledWith(
// 			'fakeProc',
// 			mockedState,
// 			expect.any(Function),
// 			'dataName',
// 		);
// 		expect(getData).toHaveBeenCalledTimes(1);
// 	});

// 	it('does not call proc on load if global values missing', async () => {
// 		render(
// 			<Data name="dataName" proc="fakeProc" params="varA&varB&varC" />,
// 		);
// 		expect(getData).not.toHaveBeenCalled();
// 	});

// 	it('updates from DB on load when NO dependant params specified', async () => {
// 		render(<Data name="dataName" proc="fakeProc" />);
// 		expect(getData).toHaveBeenCalledTimes(1);
// 		expect(getData).toHaveBeenCalledWith(
// 			'fakeProc',
// 			{},
// 			expect.any(Function),
// 			'dataName',
// 		);
// 	});

// 	it('updates from DB when dependant params update', async () => {
// 		const VALUE = 'foo';
// 		realUseGlobal();
// 		const Updater = () => {
// 			const { setData } = useData({ key: 'varA' });
// 			return <button onClick={() => setData(VALUE)} />;
// 		};
// 		render(
// 			<TestProvider>
// 				<Data name="dataName" proc="fakeProc" params="varA" />
// 				<Updater />
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByRole('button'));
// 		expect(getData).toHaveBeenCalledWith(
// 			'fakeProc',
// 			{ varA: VALUE },
// 			expect.any(Function),
// 			'dataName',
// 		);
// 		expect(getData).toHaveBeenCalledTimes(1);
// 	});

// 	it('case "first": updates when a dependent data element updates', async () => {
// 		const LISTVALUE = [
// 			{ value: 'ONE' },
// 			{ value: 'TWO' },
// 			{ value: 'THREE' },
// 		];
// 		realUseGlobal();
// 		const Updater = () => {
// 			const { setData } = useData({ key: 'list' });
// 			return <button onClick={() => setData(LISTVALUE)} />;
// 		};
// 		const Display = () => {
// 			const { data } = useData({ key: 'selected' });
// 			return <input defaultValue={data} />;
// 		};
// 		render(
// 			<TestProvider>
// 				<Data name="selected" source="list" defaultValue="first" />
// 				<Updater />
// 				<Display />
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByRole('button'));
// 		const selected = screen.getByRole('textbox').value;
// 		expect(selected).toEqual(LISTVALUE[0].value);
// 	});

// 	it('case "last": updates when a dependent data element updates', async () => {
// 		const LISTVALUE = [
// 			{ value: 'ONE' },
// 			{ value: 'TWO' },
// 			{ value: 'THREE' },
// 		];
// 		realUseGlobal();
// 		const Updater = () => {
// 			const { setData } = useData({ key: 'list' });
// 			return <button onClick={() => setData(LISTVALUE)} />;
// 		};
// 		const Display = () => {
// 			const { data } = useData({ key: 'selected' });
// 			return <input defaultValue={data} />;
// 		};
// 		render(
// 			<TestProvider>
// 				<Data name="selected" source="list" defaultValue="last" />
// 				<Updater />
// 				<Display />
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByRole('button'));
// 		const selected = screen.getByRole('textbox').value;
// 		expect(selected).toEqual(LISTVALUE[2].value);
// 	});
// });

// xdescribe('Data component with route parameter', () => {
// 	beforeEach(() => {
// 		mockUseGlobal();
// 	});
// 	it('works with minimal args', async () => {
// 		const parsedPathParams = {
// 			foo: 1,
// 			bar: 2,
// 		};
// 		global.URLPattern = class {
// 			exec() {
// 				return {
// 					pathname: {
// 						groups: parsedPathParams,
// 					},
// 				};
// 			}
// 		};
// 		render(<Data name="myPathData" route="/base{/}?:foo?{/sub/}?:bar?" />);
// 		expect(setState).toHaveBeenCalledWith({ myPathData: parsedPathParams });
// 	});
// });

// describe('Enhanced arguments', () => {
// 	it('should handle getForm', async () => {
// 		const args = { getForm: 'myFormKey' };
// 		const enhanced = enhanceArgs(args);
// 		expect(enhanced).toEqual({
// 			getForm: 'myFormKey',
// 			name: 'myFormKey',
// 			proc: 'ui.sp_formElementsGetbyFormKey',
// 			procArg: 'myFormKey',
// 		});
// 	});
// 	it('should handle getOpts', async () => {
// 		const args = { getOpts: 'myOptsKey' };
// 		const enhanced = enhanceArgs(args);
// 		expect(enhanced).toEqual({
// 			getOpts: 'myOptsKey',
// 			name: 'myOptsKey',
// 			proc: 'ui.sp_GetOptionLists',
// 			procArg: 'myOptsKey',
// 		});
// 	});
// 	it('should handle getData', async () => {
// 		const args = { getData: 'myDataKey' };
// 		const enhanced = enhanceArgs(args);
// 		expect(enhanced).toEqual({
// 			getData: 'myDataKey',
// 			name: 'myDataKey',
// 			proc: 'ui.sp_GetData',
// 			procArg: 'myDataKey',
// 		});
// 	});
// 	it('should handle getList', async () => {
// 		const args = { getList: 'myListKey' };
// 		const enhanced = enhanceArgs(args);
// 		expect(enhanced).toEqual({
// 			getList: 'myListKey',
// 			name: 'myListKey',
// 			proc: 'ui.sp_GetResourceListViews',
// 			procArg: 'myListKey',
// 		});
// 	});
// 	it('should NOT override', async () => {
// 		const args = { getList: 'myListKey', name: 'customDataKey' };
// 		const enhanced = enhanceArgs(args);
// 		expect(enhanced).toEqual({
// 			getList: 'myListKey',
// 			name: 'customDataKey',
// 			proc: 'ui.sp_GetResourceListViews',
// 			procArg: 'myListKey',
// 		});
// 	});
// 	it.todo('should warn when using proc,procArg with get-prefixed params');
// 	it.todo('should ignore unsupported get-prefixed props');
// });
