describe('disabled', () => {
	it('disabled', () => {});
});

// import { act, fireEvent, render, waitFor } from '@testing-library/react';
// import { useData } from './useData';
// import { useEffect, useState } from 'react';
// import { TestProvider } from '../contexts';
// import { useGlobal } from './useGlobal';

// jest.mock('../hooks/useGlobal.js');

// const setState = jest.fn();
// const mockUseGlobal = (mockedState) => {
// 	useGlobal.mockImplementation(() => {
// 		return {
// 			state: mockedState,
// 			setState,
// 			dispatch: jest.fn(),
// 		};
// 	});
// };

// xdescribe('tests data hook using input', () => {
// 	it.todo(
// 		'Could we not just test useData as if it were a function and (mostly) forget React here?',
// 	);

// 	xit('uses global value', async () => {
// 		const BindingTest = () => {
// 			const { getData, data: localData } = useData({
// 				key: 'test2',
// 			});
// 			return (
// 				<>
// 					<div data-testid="global">{getData('test')}</div>
// 					<div data-testid="local">{localData}</div>
// 				</>
// 			);
// 		};

// 		mockUseGlobal({
// 			test: 'some string',
// 			test2: 'some string 2',
// 		});
// 		const { getByTestId } = render(
// 			<TestProvider>
// 				<BindingTest />
// 			</TestProvider>,
// 		);
// 		const global = getByTestId('global');
// 		const local = getByTestId('local');
// 		expect(global.innerHTML).toBe('some string');
// 		expect(local.innerHTML).toEqual('some string 2');
// 	});

// 	//TODO: fix this, failing on 'global.innerHTML not equal to local.innerHTML'
// 	xit('should update local if global has updated', () => {
// 		const KEY = 'test';
// 		const VALUE = '123';

// 		const Updater = () => {
// 			const { setState } = useGlobal();
// 			useEffect(() => {
// 				setState({ [KEY]: VALUE });
// 			}, []);
// 			return <></>;
// 		};
// 		const Listener = () => {
// 			const [localData, setLocalData] = useState();
// 			const { getData } = useData({
// 				data: localData,
// 				key: KEY,
// 				setData: setLocalData,
// 			});
// 			return (
// 				<>
// 					<div data-testid="global">{getData(KEY)}</div>
// 					<div data-testid="local">{localData}</div>
// 				</>
// 			);
// 		};

// 		const { getByTestId } = render(
// 			<TestProvider>
// 				<Listener />
// 				<Updater />
// 			</TestProvider>,
// 		);

// 		const global = getByTestId('global');
// 		const local = getByTestId('local');

// 		expect(global.innerHTML).toBe(VALUE);
// 		expect(global.innerHTML).toEqual(local.innerHTML);
// 	});
// 	xit('should update global if local updated', async () => {
// 		mockUseGlobal({});
// 		const KEY = 'test';
// 		const VALUE = 'new string';

// 		const Listener = () => {
// 			const { getData } = useData();
// 			return <div data-testid="global">{getData('test')}</div>;
// 		};
// 		const Updater = () => {
// 			const { data: localData, setData: setLocalData } = useData({
// 				key: KEY,
// 			});
// 			const handleClick = () => {
// 				setLocalData(VALUE);
// 			};
// 			return (
// 				<>
// 					<div data-testid="local">{localData}</div>
// 					<button data-testid="button" onClick={handleClick}></button>
// 				</>
// 			);
// 		};

// 		const { getByTestId } = render(
// 			<TestProvider>
// 				<Listener />
// 				<Updater />
// 			</TestProvider>,
// 		);
// 		await waitFor(async () => {
// 			fireEvent.click(getByTestId('button'));
// 		});
// 		// const global = getByTestId('global');
// 		// const local = getByTestId('local');
// 		// expect(global.innerHTML).toBe(VALUE);
// 		// expect(global.innerHTML).toEqual(local.innerHTML);
// 		await waitFor(() =>
// 			expect(setState).toHaveBeenCalledWith({ test: 'new string' }),
// 		);
// 	});
// });
