import { StateManager } from '../../state/state';
import { handleDateKeywords } from './dateKeywords';

describe('dateKeywords', () => {
	beforeAll(() => {
		StateManager.init({
			todayDate: '2024-02-20',
		});
	});

	const thisDay = new Date().getDate();
	const thisMonth = new Date().getUTCMonth() + 1;
	const monthStr = thisMonth < 10 ? `0${thisMonth}` : thisMonth;
	const thisYear = new Date().getFullYear();

	describe('dateNow', () => {
		it('should return current date in yyyy-MM-dd', () => {
			const result = handleDateKeywords('dateNow');

			expect(result).toBe(`${thisYear}-${monthStr}-${thisDay}`);
		});
	});

	xdescribe('dateNowLong', () => {
		it('should return current date in human readable date "Weekday, Month Day"', () => {
			const result = handleDateKeywords('dateNowLong');
			expect(result).toBe(``);
		});
	});

	xdescribe('dateTimeNow', () => {
		it('should return current date in yyyy-MM-dd HH:mm:ss', () => {
			const result = handleDateKeywords('dateTimeNow');
			expect(result).toBe(``);
		});
	});

	xdescribe('dateNowMinus/dateNowPlus - operations on today', () => {
		it('should add 1 day to today', () => {
			const result = handleDateKeywords('dateNowPlus1day');

			expect(result).toBe(``);
		});
		it('should subtract 1 day from today', () => {
			const result = handleDateKeywords('dateNowMinus1day');

			expect(result).toBe(``);
		});
	});

	describe('datePlus()/dateMinus() - operations on dates passed as param', () => {
		it('should add 1 day to an existent date', () => {
			const dateKeyword = 'datePlus1day(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-02-21');
		});

		it('should add 7 days to an existent date', () => {
			const dateKeyword = 'datePlus7days(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-02-27');
		});

		it('should add 1 month to an existent date', () => {
			const dateKeyword = 'datePlus1month(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-03-20');
		});

		it('should add 3 months to an existent date', () => {
			const dateKeyword = 'datePlus3months(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-05-20');
		});

		it('should add 1 year to an existent date', () => {
			const dateKeyword = 'datePlus1year(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2025-02-20');
		});

		it('should add 30 years to an existent date', () => {
			const dateKeyword = 'datePlus30years(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2054-02-20');
		});

		it('should subtract 1 day to an existent date', () => {
			const dateKeyword = 'dateMinus1day(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-02-19');
		});

		it('should subtract 7 days to an existent date', () => {
			const dateKeyword = 'dateMinus7days(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-02-13');
		});

		it('should subtract 1 month to an existent date', () => {
			const dateKeyword = 'dateMinus1month(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2024-01-20');
		});

		it('should subtract 13 months to an existent date', () => {
			const dateKeyword = 'dateMinus13months(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2023-01-20');
		});

		it('should subtract 1 year to an existent date', () => {
			const dateKeyword = 'dateMinus1year(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2023-02-20');
		});

		it('should subtract 10 years to an existent date', () => {
			const dateKeyword = 'dateMinus10years(global_todayDate)';

			const result = handleDateKeywords(dateKeyword);

			expect(result).toBe('2014-02-20');
		});
	});
});
