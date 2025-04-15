const { DateTime } = require('./parseDates');
const timeZone = 'America/New_York';
const timezone_mock = require('timezone-mock');

//TODO: these tests need a mocked Date constructor: https://bengry.medium.com/testing-dates-and-timezones-using-jest-10a6a6ecf375

describe('parse dates: without assumption', () => {
	beforeAll(() => {
		DateTime.setAssume(false);
	});
	afterAll(() => {
		DateTime.setAssume(true);
	});
	it('global datetime to local', () => {
		const globalDateString = '2014-06-25T10:00:00.000Z';

		const globalUtc = DateTime.toGlobal(globalDateString, timeZone);
		const localWithAmericaTz = DateTime.toLocal(globalDateString, timeZone);

		expect(globalUtc).toBe('2014-06-25T10:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T06:00');
	});
	xit('global Date instance to local', () => {
		const globalDate = new Date('2014-06-25T10:00:00.000Z');

		const globalUtc = DateTime.toGlobal(globalDate, timeZone);
		const localWithAmericaTz = DateTime.toLocal(globalDate, timeZone);

		expect(globalUtc).toBe('2014-06-25T10:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T10:00');
	});

	it('local datetime to global', () => {
		const localDateString = '2014-06-25T06:00';

		const globalUtc = DateTime.toGlobal(localDateString, timeZone);
		const localWithAmericaTz = DateTime.toLocal(localDateString, timeZone);

		expect(globalUtc).toBe('2014-06-25T10:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T06:00');
	});
	it('local Date to global', () => {
		const localDate = new Date('2014-06-25T06:00');

		const globalUtc = DateTime.toGlobal(localDate, timeZone);
		const localWithAmericaTz = DateTime.toLocal(localDate, timeZone);

		expect(globalUtc).toBe('2014-06-25T10:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T06:00');
	});

	it('local month to global', () => {
		const localDateString = '2014-06';

		const globalUtc = DateTime.toGlobal(localDateString, timeZone);
		const localWithAmericaTz = DateTime.toLocal(localDateString, timeZone);

		//not ideal, would prefer 2014-06-01T00:00:00.000Z
		expect(globalUtc).toBe('2014-06-01T04:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-01T00:00');
	});
	it('local date (not datetime) to global', () => {
		const localDateString = '2014-06-25';

		const globalUtc = DateTime.toGlobal(localDateString, timeZone);
		const localWithAmericaTz = DateTime.toLocal(localDateString, timeZone);

		//not ideal, would prefer 2014-06-25T00:00:00.000Z
		expect(globalUtc).toBe('2014-06-25T04:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T00:00');
	});

	//Daylight Saving Time - for 2023 Eastern, DST ended on 11-05
	it('During DST - local date to global', () => {
		const localDateString = '2023-10-30T15:00';
		const globalUtc = DateTime.toGlobal(localDateString, timeZone);
		expect(globalUtc).toContain('T19:00');

		const globalUtcBZ = DateTime.toGlobal(localDateString, 'Brazil/East');
		expect(globalUtcBZ).toContain('T18:00');
	});
	it('After DST - local date to global', () => {
		const localDateString = '2023-11-06T15:00';
		const globalUtc = DateTime.toGlobal(localDateString, timeZone);

		const globalUtcBZ = DateTime.toGlobal(localDateString, 'Brazil/East');
		expect(globalUtcBZ).toContain('T18:00');
	});

	it.todo('week ?');
	it.todo('time (only) ?');
});

/*
CASE: Date is originally generated in DB
Started in DB as                      : 2014-06-25 10:00:00.000
API assumes this means                : 2014-06-25T10:00:00.000Z
Browser(EDT) assumes                  : 2014-06-25T10:00:00.000-0400 -> (toLocal adds 4) -> 2014-06-25T14:00:00.000Z
shows in component (dat-fns/format)   : 2014-06-25 10:00:00.000
Submitted to DB assume                : 2014-06-25T14:00:00.000Z -> (toGlobal subtracts 4) -> 2014-06-25T10:00:00.000Z

CASE: Date is generated in Browser
input component shows                 : 2014-06-25 10:00:00.000
when this value is in Date object     : 2014-06-25T14:00:00.000Z
Submitted to DB assume                : 2014-06-25T14:00:00.000Z -> (toGlobal subtracts 4) -> 2014-06-25T10:00:00.000Z
*/
describe('parse dates: assume database timezone', () => {
	it('global datetime to local', () => {
		const globalDateString = '2014-06-25T10:00:00.000Z';

		const globalUtc = DateTime.toGlobal(globalDateString, timeZone);
		const localWithAmericaTz = DateTime.toLocal(globalDateString, timeZone);

		expect(globalUtc).toBe('2014-06-25T14:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T10:00');
	});
	it('local datetime to global', () => {
		const localDateString = '2014-06-25T06:00';

		const globalUtc = DateTime.toGlobal(localDateString, timeZone);
		const localWithAmericaTz = DateTime.toLocal(localDateString, timeZone);

		expect(globalUtc).toBe('2014-06-25T10:00:00.000Z');
		expect(localWithAmericaTz).toBe('2014-06-25T06:00');
	});
});

describe('assumption: date in Zulu is actually date in current time zone', () => {
	it('outside DST', () => {
		const dateFromDB = '2023-11-22T00:00:00.000Z';
		const result = DateTime.assume(dateFromDB);
		const localeDate = new Date(result).toLocaleString('en-US');
		expect(result).toBe('2023-11-22T00:00:00.000-0500');
		expect(localeDate).toBe('11/22/2023, 12:00:00 AM');
	});
	it('inside DST', () => {
		const dateFromDBDST = '2023-08-01T00:00:00.000Z';
		const resultDST = DateTime.assume(dateFromDBDST);
		const localeDateDST = new Date(resultDST).toLocaleString('en-US');
		expect(resultDST).toBe('2023-08-01T00:00:00.000-0400');
		expect(localeDateDST).toBe('8/1/2023, 12:00:00 AM');
	});
});
