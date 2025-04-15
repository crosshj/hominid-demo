import { getItemSize } from './size';

describe('size calculator (original algo)', () => {
	it('should handle 50/50 scenario', async () => {
		const all = [{ value: 250 }, { value: 250 }];
		const total = all.reduce((a, o) => a + o.value, 0);
		expect(getItemSize(all[1].value, total, all.length)).toBe('50%');
	});
	it('should respect min width of 15%', async () => {
		const all = [{ value: 25 }, { value: 25 }, { value: 250 }];
		const total = all.reduce((a, o) => a + o.value, 0);
		expect(getItemSize(all[0].value, total, all.length)).toBe(
			'29.583333333333332%',
		);
		expect(getItemSize(all[1].value, total, all.length)).toBe(
			'29.583333333333332%',
		);
		expect(getItemSize(all[2].value, total, all.length)).toBe(
			'40.83333333333333%',
		);
	});
});

describe('size calculator (alternate algo)', () => {
	it('should handle 50/50 scenario', async () => {
		const all = [{ value: 250 }, { value: 250 }];
		expect(getItemSize({ all, index: 1 })).toBe('50%');
	});
	xit('should respect min width of 15%', async () => {
		const all = [{ value: 25 }, { value: 25 }, { value: 250 }];
		expect(getItemSize({ all, index: 0 })).toBe('15.083798882681565%');
		expect(getItemSize({ all, index: 1 })).toBe('15.083798882681565%');
		expect(getItemSize({ all, index: 2 })).toBe('69.83240223463687%');
	});
});
