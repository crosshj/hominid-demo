describe('disabled', () => {
	it('disabled', () => {});
});

// import { Select } from './Select';
// import { Select_Props_1, Select_Props_2 } from '../fixtures';

// describe('Select', () => {
// 	it('should return expected props', () => {
// 		const { propsShimmed, childrenShimmed } = Select(Select_Props_1);

// 		// validating children
// 		expect(Array.isArray(childrenShimmed)).toBe(true);
// 		expect(childrenShimmed.length).toBe(3);

// 		for (const { props } of childrenShimmed) {
// 			expect(typeof props.value).toBe('number');
// 			expect(typeof props.children).toBe('string');
// 		}

// 		// validating propsShimmed
// 		expect(Object.keys(propsShimmed).length).toBe(4);

// 		expect(propsShimmed.SelectProps).toEqual({ native: true });
// 		expect(propsShimmed.fullWidth).toBe(true);
// 		expect(propsShimmed.value).toBe('2');
// 		expect(typeof propsShimmed.onChange).toBe('function');
// 	});

// 	it('should return expected props (2)', () => {
// 		const { propsShimmed, childrenShimmed } = Select(Select_Props_2);

// 		// validating childrenShimmed
// 		expect(Array.isArray(childrenShimmed)).toBe(true);
// 		expect(childrenShimmed.length).toBe(6);

// 		for (const { props } of childrenShimmed) {
// 			expect(typeof props.value).toBe('number');
// 			expect(typeof props.children).toBe('string');
// 		}

// 		// validating props
// 		expect(Object.keys(propsShimmed).length).toBe(4);

// 		expect(propsShimmed.SelectProps).toEqual({ native: true });
// 		expect(propsShimmed.fullWidth).toBe('fullWidth');

// 		// value comes from 'selectedAssignment', updated o "beforeAll"
// 		expect(propsShimmed.value).toBe('1');
// 		expect(typeof propsShimmed.onChange).toBe('function');
// 	});
// });
