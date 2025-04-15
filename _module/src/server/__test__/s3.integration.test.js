require('dotenv').config();
const { execDB, close: closeDB } = require('../integrations/database');
const { upload, download } = require('../integrations/s3.js');
const session = require('../store/Session.js');

describe('Database Integration', () => {
	beforeAll(() => {
		process.env.ISLOCAL = true;
		jest.setTimeout(30000);
	});

	afterAll(() => {
		closeDB();
	});

	it('save a file, get URL', async () => {
		const results = await upload({
			Key: 'testing1.txt',
			Body: 'NOT THAT HARD',
		});
		console.log({ results });
	});

	it('get file from URL', async () => {
		const donwloadResults = await download({
			Key: 'testing1.txt',
		});
		const stringResults = donwloadResults.data.Body.toString();
		console.log({ donwloadResults, stringResults });
	});
});
