require('dotenv').config();
const { decryptResults } = require('./Encryption');

describe('processResponse', () => {
	const apiResponse = [
		{
			uuid: 'foo',
			results: JSON.stringify([
				{
					FirstName: 'John',
					LastName: 'Doe',
					Secret_Encrypted:
						'89lD1dezbO14+LTUsfEsbsRqv/DJ8shHheHt4AwFkzQ=',
					City: 'New York',
				},
			]),
		},
	];

	const expectedResult = [
		{
			uuid: 'foo',
			results: JSON.stringify([
				{
					FirstName: 'John',
					LastName: 'Doe',
					Secret: '123-45-6780',
					City: 'New York',
				},
			]),
		},
	];

	//TODO: will only work locally with a proper .env
	it.skip('should process all responses and decrypt columns with _Encrypted', () => {
		const result = decryptResults(apiResponse);
		expect(result).toEqual(expectedResult);
	});

	it('should process all responses and decrypt columns with _Encrypted', () => {
		const result = decryptResults(apiResponse, {
			key: 'D9DUuLISlBph/Qu6b9J8PmWQDaBF1K6W7gENxtSZyXE=',
			iv: 'Yf0Lum/SfD6qiKgOkCscog==',
		});
		expect(result).toEqual(expectedResult);
	});
});
