describe('disabled', () => {
	it('disabled', () => {});
});

// import { useState } from 'react';
// import '@testing-library/jest-dom/extend-expect';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// import { TestProvider } from '../../contexts';
// import { useFlow } from '../../hooks/useFlow';

// import { Button } from '../Button';
// import { Flow } from '.';

// const setState = jest.fn();
// const addFlow = jest.fn();
// const runFlow = jest.fn();
// const removeFlow = jest.fn();

// jest.mock('react', () => ({
// 	...jest.requireActual('react'),
// 	useState: jest.fn(),
// }));

// jest.mock('../../hooks/useFlow.js');

// const mockUseFlow = () => {
// 	useFlow.mockImplementation((stepValue) => {
// 		const [step, setStep] = useState(stepValue);
// 		return { addFlow, runFlow, removeFlow, step, setStep };
// 	});
// };

// const useActualUseFlow = () => {
// 	useFlow.mockImplementation(
// 		jest.requireActual('../../hooks/useFlow.js').useFlow,
// 	);
// };

// const useActualSetState = () => {
// 	useState.mockImplementation(jest.requireActual('react').useState);
// };
// const useMockedSetState = () => {
// 	useState.mockImplementation((init) => [init, setState]);
// };

// describe('tests flow component', () => {
// 	beforeEach(() => {
// 		useMockedSetState();
// 		mockUseFlow();
// 	});
// 	it('base case, a flow with key(id) but no props', async () => {
// 		/* NOTE: "id" -> "key", react cannot use "key" as prop name*/
// 		render(<Flow id="testFlow" />);
// 		expect(addFlow).toHaveBeenCalledWith({ key: 'testFlow' });
// 	});
// 	it('ignore a flow with no key(id)', async () => {
// 		render(<Flow />);
// 		expect(addFlow).not.toHaveBeenCalled();
// 	});
// 	it('handles stepping triggered from button click', async () => {
// 		useActualSetState();
// 		useActualUseFlow();

// 		const spy = jest.fn();
// 		const MockFlowStep = ({ name, step, onStep }) => {
// 			spy({ name, step });
// 			return null;
// 		};
// 		render(
// 			<TestProvider>
// 				<Flow id="testFlow">
// 					<MockFlowStep name="one" />
// 					<MockFlowStep name="two" />
// 				</Flow>
// 				<Button flow="testFlow">trigger flow</Button>
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByText('trigger flow'));
// 		fireEvent.click(screen.getByText('trigger flow'));
// 		await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
// 		await waitFor(() =>
// 			expect(spy).toHaveBeenCalledWith({ name: 'one', step: 0 }),
// 		);
// 		await waitFor(() =>
// 			expect(spy).toHaveBeenCalledWith({ name: 'two', step: 1 }),
// 		);
// 	});
// 	it('handles stepping triggered from onStep', async () => {
// 		useActualSetState();
// 		useActualUseFlow();

// 		const spy = jest.fn();
// 		const MockFlowStep = ({ name, step, onStep }) => {
// 			spy({ name, step });
// 			setTimeout(onStep, 1);
// 			return null;
// 		};
// 		render(
// 			<TestProvider>
// 				<Flow id="testFlow">
// 					<MockFlowStep name="one" />
// 					<MockFlowStep name="two" />
// 				</Flow>
// 				<Button flow="testFlow">trigger flow</Button>
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByText('trigger flow'));
// 		await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
// 		await waitFor(() =>
// 			expect(spy).toHaveBeenCalledWith({ name: 'one', step: 0 }),
// 		);
// 		await waitFor(() =>
// 			expect(spy).toHaveBeenCalledWith({ name: 'two', step: 1 }),
// 		);
// 	});
// });
