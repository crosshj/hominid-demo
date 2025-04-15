import { Link } from './Link';

describe('Link', () => {
	it('should return expected props', () => {
		const { propsShimmed } = Link({
			propsIntact: { anyProp: 1, href: 'that/' },
			propsFilled: { href: 'this/' },
		});

		expect(typeof propsShimmed.onClickShimmed).toBe('function');
		expect(Object.keys(propsShimmed).length).toBe(1);
		expect(Object.keys(propsShimmed)).toEqual(['onClickShimmed']);
	});
});
