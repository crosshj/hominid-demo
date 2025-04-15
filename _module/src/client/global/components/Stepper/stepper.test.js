describe('disabled', () => {
	it('disabled', () => {});
});

// import { fireEvent, render, screen } from '@testing-library/react';
// import { Stepper, Typography, Step } from '..';
// import { TestProvider } from '../../contexts/test.js';

// import {
// 	mockUseGlobal,
// 	useActualUseGlobal,
// } from '../../hooks/useGlobal.mock.js';

// jest.mock('../../hooks/useGlobal.js');

// /*
// below xit's because tests were failing
// */
// describe('Tests Stepper', () => {
// 	beforeEach(() => {
// 		mockUseGlobal({ selectedStep: 0 });
// 	});
// 	xit('should render only the first step as default', async () => {
// 		render(
// 			<Stepper>
// 				<Step type="Step" label="First" key="0">
// 					<Typography>First Step</Typography>
// 				</Step>

// 				<Step type="Step" label="Second" key="1">
// 					<Typography>Second Step</Typography>
// 				</Step>
// 			</Stepper>,
// 		);
// 		await screen.findByText('First Step');
// 		expect(screen.queryByText('Second Step')).toBeNull();
// 	});

// 	xit('should handle forward navigation', async () => {
// 		useActualUseGlobal();

// 		render(
// 			<TestProvider>
// 				<Stepper>
// 					<Step type="Step" label="First" key="0">
// 						<Typography>First Step</Typography>
// 					</Step>

// 					<Step type="Step" label="Second" key="1">
// 						<Typography>Second Step</Typography>
// 					</Step>
// 				</Stepper>
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByText('Continue'));

// 		await screen.findByText('Second Step');
// 	});
// 	xit('should handle backward navigation', async () => {
// 		useActualUseGlobal();

// 		render(
// 			<TestProvider>
// 				<Stepper>
// 					<Step type="Step" label="First" key="0">
// 						<Typography>First Step</Typography>
// 					</Step>

// 					<Step type="Step" label="Second" key="1">
// 						<Typography>Second Step</Typography>
// 					</Step>
// 					<Step type="Step" label="Third" key="2">
// 						<Typography>Third Step</Typography>
// 					</Step>
// 				</Stepper>
// 			</TestProvider>,
// 		);
// 		fireEvent.click(screen.getByText('Continue'));
// 		fireEvent.click(screen.getByText('Back'));

// 		await screen.findByText('First Step');
// 	});
// 	it('should render step labels', async () => {
// 		render(
// 			<Stepper>
// 				<Step label="First"></Step>
// 				<Step label="Second"></Step>
// 			</Stepper>,
// 		);
// 		await screen.findByText('First');
// 		await screen.findByText('Second');
// 	});
// });
