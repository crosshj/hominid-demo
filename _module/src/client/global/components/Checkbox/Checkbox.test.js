// import '@testing-library/jest-dom/extend-expect';

// import { useData } from 'global/hooks/useData';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { Checkbox } from 'global/components/Checkbox';
// import { Data } from 'global/components/Data';
// import { TestProvider } from 'global/contexts/test';

// // jest.mock('global/hooks/useData.js');

// const KEY = 'foo';

// const Consumer = ({ useDataKey = KEY }) => {
// 	const { data } = useData({ key: useDataKey });
// 	return <>{JSON.stringify(data)}</>;
// };

xdescribe('tests Checkbox component', () => {
	it('should be disabled if useData and id are missing', () => {
		render(
			<TestProvider>
				<Checkbox />
			</TestProvider>,
		);

		expect(screen.getByTestId('checkbox-undefined')).toBeDisabled();
	});
	it('should render with undefined as default state', () => {
		render(
			<TestProvider>
				<Data name={KEY} defaultValue="false" />
				<Checkbox useData={KEY} />
				<Consumer />
			</TestProvider>,
		);
		screen.getByText('false');
	});
	it('should toggle global state when checked', async () => {
		render(
			<TestProvider>
				<Data name={KEY} defaultValue="false" />
				<Checkbox useData={KEY} />
				<Consumer />
			</TestProvider>,
		);

		fireEvent.click(screen.getByTestId(`checkbox-${KEY}`));
		await waitFor(async () => {
			screen.getByText('true');
		});
	});
	it('should be false if clicked two times', async () => {
		render(
			<TestProvider>
				<Data name={KEY} defaultValue="false" />
				<Checkbox useData={KEY} />
				<Consumer />
			</TestProvider>,
		);

		fireEvent.click(screen.getByTestId(`checkbox-${KEY}`));
		fireEvent.click(screen.getByTestId(`checkbox-${KEY}`));

		await waitFor(async () => {
			screen.getByText('false');
		});
	});
	it('should support data-name as subkey', async () => {
		render(
			<TestProvider>
				<Data name="foo.bar" defaultValue="false" />
				<Checkbox useData={KEY} data-name="bar" />
				<Consumer useDataKey="foo.bar" />
			</TestProvider>,
		);

		fireEvent.click(screen.getByTestId(`checkbox-foo.bar`));

		await waitFor(async () => {
			screen.getByText('true');
		});
	});
	it('should support nested key for useData', async () => {
		render(
			<TestProvider>
				<Data name="foo.bar" defaultValue="false" />
				<Checkbox useData="foo.bar" />
				<Consumer useDataKey="foo.bar" />
			</TestProvider>,
		);

		fireEvent.click(screen.getByTestId(`checkbox-foo.bar`));

		await waitFor(async () => {
			screen.getByText('true');
		});
	});
});
