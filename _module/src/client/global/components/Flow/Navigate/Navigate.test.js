describe('disabled', () => {
	it('disabled', () => {});
});

// import { render } from '@testing-library/react';
// import { Navigate } from './index';
// import { mockUseGlobal, navigate } from '../../../hooks/useGlobal.mock';

// jest.mock('../../../hooks/useGlobal.mock');

// describe('tests Navigate component', () => {
// 	beforeEach(() => mockUseGlobal());
// 	it('should not navigate if route is missing', () => {
// 		render(<Navigate />);
// 		expect(navigate).not.toHaveBeenCalled();
// 	});
// 	it('should navigate to the specified route', () => {
// 		render(<Navigate route="test" />);
// 		expect(navigate).toHaveBeenCalledWith('test');
// 	});
// });

// describe('Navigate with path pattern', () => {
// 	beforeEach(() => mockUseGlobal());
// 	it('should handle a navigation using path pattern', () => {
// 		const onStep = jest.fn();
// 		global.dispatchEvent = jest.fn();
// 		global.history.pushState = jest.fn();
// 		render(
// 			<Navigate
// 				onStep={onStep}
// 				path="/featuresPathBasedData{/}?{:foo}?"
// 			/>,
// 		);
// 		expect(global.history.pushState).toHaveBeenCalledWith(
// 			{},
// 			null,
// 			'/featuresPathBasedData{/}?{:foo}?',
// 		);
// 		expect(global.dispatchEvent).toHaveBeenCalledWith(
// 			expect.objectContaining({
// 				isTrusted: false,
// 			}),
// 		);
// 		expect(onStep).toHaveBeenCalled();
// 	});
// });
