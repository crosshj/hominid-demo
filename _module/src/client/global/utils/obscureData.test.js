import obscureData from './obscureData';

describe('obscureData', () => {
	const sampleData1 = '123-45-6789';
	const sampleData2 = 'johndoe@example.com';
	const sampleData3 = '555-123-4567';
	const sampleData4 = 123456789;

	test('totally obscured', () => {
		expect(obscureData(sampleData1, true)).toBe('●●●-●●-●●●●');
		expect(obscureData(sampleData2, true)).toBe('●●●●●●●●●●●●●●●●●●●');
		expect(obscureData(sampleData3, true)).toBe('●●●-●●●-●●●●');
		expect(obscureData(sampleData4, true)).toBe('●●●●●●●●●');
	});

	test('displayed obscured data', () => {
		expect(obscureData(sampleData1, false)).toBe(sampleData1);
		expect(obscureData(sampleData2, false)).toBe(sampleData2);
		expect(obscureData(sampleData3, false)).toBe(sampleData3);
		expect(obscureData(sampleData4, false)).toBe('123456789');
	});

	test('last 4 characters', () => {
		expect(obscureData(sampleData1, 'last4')).toBe('●●●-●●-6789');
		expect(obscureData(sampleData2, 'last4')).toBe('●●●●●●●●●●●●●●●.com');
		expect(obscureData(sampleData3, 'last4')).toBe('●●●-●●●-4567');
		expect(obscureData(sampleData4, 'last4')).toBe('●●●●●6789');
	});

	test('unknown obscure option', () => {
		expect(obscureData(sampleData1, 'unknown')).toBe(sampleData1);
	});
});
