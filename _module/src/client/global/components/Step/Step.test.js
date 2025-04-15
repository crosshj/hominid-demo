describe('disabled', () => {
	it('disabled', () => {});
});

// import { Step } from '.';
// import { render, screen } from '@testing-library/react';

// import { mockUseGlobal } from 'global/hooks/useGlobal.mock.js';

// describe('tests Step component', () => {
// 	beforeEach(() => {
// 		mockUseGlobal({ steps: [1, 2, 3], selectedStep: 2 });
// 	});
// 	it('should render its children', () => {
// 		render(
// 			<Step>
// 				<button>child</button>
// 			</Step>
// 		);
// 		expect(screen.getByText('child')).not.toBeNull();
// 	});

// 	it('should allow back and forward buttons to be customized', async () => {
// 		const LABELS = ['backCustomized', 'forwardCustomized'];
// 		render(
// 			<Step previousButtonLabel={LABELS[0]} nextButtonLabel={LABELS[1]} />
// 		);

// 		const cancelLabel = await screen.findByText(LABELS[0]);
// 		const nextLabel = await screen.findByText(LABELS[1]);

// 		expect(cancelLabel).toBeDefined();
// 		expect(nextLabel).toBeDefined();
// 	});

// 	it("shouldn't render cancel button if last step", () => {
// 		render(<Step isLastStep={true} />);
// 		expect(screen.queryByText('Cancel')).toBeNull();
// 	});
// });
