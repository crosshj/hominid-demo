// const {
// 	render,
// 	waitFor,
// 	fireEvent,
// 	screen,
// } = require('@testing-library/react');

// const { TestProvider } = require('global/contexts/test.js');
// const { Selector } = require('framework/components/Selector/index.jsx');
// const { useData } = require('global/hooks/useData');

// const KEY = 'foo';
// const DATANAME = 'username';
// const VALUE = 'bar';

// //gets some key from data returned from hook
// const Consumer = (props) => {
// 	const dataName = props['data-name'];
// 	const { data } = useData({ key: `${KEY}.${dataName}` });

// 	return <div data-testid="consumer">{data}</div>;
// };

xdescribe('tests input connection with global state and parent form', () => {
	xit('should update global state if both useData and data-name props were passed', async () => {
		render(
			<TestProvider>
				<Selector
					type="Input"
					id="testInput"
					props={{ useData: KEY, 'data-name': DATANAME }}
				/>
				<Consumer data-name={DATANAME} />
			</TestProvider>,
		);
		const consumer = screen.getByTestId('consumer');
		const input = screen.getByTestId('input-testInput');

		fireEvent.change(input, { target: { value: VALUE } });
		await waitFor(async () => {
			expect(consumer.innerHTML).toBe(VALUE);
		});
	});
	xit('should update global state on same use data key but different data names', async () => {
		render(
			<TestProvider>
				<Selector
					type="Input"
					id="testInput"
					props={{ useData: KEY, 'data-name': DATANAME }}
				/>
				<Consumer data-name={DATANAME} />
			</TestProvider>,
		);
		const consumer = screen.getByTestId('consumer');
		const input = screen.getByTestId('input-testInput');

		fireEvent.change(input, { target: { value: VALUE } });
		await waitFor(async () => {
			expect(consumer.innerHTML).toBe(VALUE);
		});
	});
});
