import { add, format, sub } from 'date-fns';
import { getTodayLongDate } from './getTodayLongDate';
import { StateManager } from '../../state/state';
import { DateTime } from './parseDates';

const isDateKeyword = (valueSrc) => {
	return [
		'dateNowLong',
		'dateNow',
		'dateTimeNow',
		'dateNowPlus',
		'dateNowMinus',
		'dateMinus',
		'datePlus',
	].some((x) => String(valueSrc).startsWith(x));
};
export { isDateKeyword };

export const handleDateKeywords = (valueSrc) => {
	if (typeof valueSrc !== 'string' || !isDateKeyword(valueSrc))
		return valueSrc;

	const TODAY = new Date();

	if (valueSrc === 'dateNowLong') return getTodayLongDate();
	if (valueSrc === 'dateTimeNow') return format(TODAY, 'yyyy-MM-dd HH:mm:ss');
	if (valueSrc === 'dateNow') return format(TODAY, 'yyyy-MM-dd');

	/**
	 * Removes keyword from the duration string, returning only the amount
	 *
	 * @param {string} d - duration string (30days, 1day, 2months, 1month, 1year, 2years)
	 * @param {string} dKeyword - "day" | "days" | "hour" | "hours"...
	 * @returns {number | undefined}
	 */
	const getAmount = (d, dKeyword = '') => {
		return d.includes(dKeyword)
			? Number(d.replace(dKeyword, ''))
			: undefined;
	};

	/**
	 *
	 * @param {string} d - duration string (30days, 1day, 2months, 1month, 1year, 2years)
	 * @returns
	 */
	const getDurations = (d) => ({
		days: getAmount(d, 'days') || getAmount(d, 'day'),
		hours: getAmount(d, 'hours') || getAmount(d, 'hour'),
		minutes: getAmount(d, 'minutes') || getAmount(d, 'minute'),
		months: getAmount(d, 'months') || getAmount(d, 'month'),
		weeks: getAmount(d, 'weeks') || getAmount(d, 'weeks'),
		years: getAmount(d, 'years') || getAmount(d, 'year'),
	});

	if (
		valueSrc.startsWith('dateNowPlus') ||
		valueSrc.startsWith('dateNowMinus')
	) {
		const operation = valueSrc.startsWith('dateNowPlus') ? 'Plus' : 'Minus';

		// 30days, 5months, 2hours, 1day
		const durationString = valueSrc
			.replace('dateNow' + operation, '')
			.toLowerCase();

		const durations = getDurations(durationString);

		const finalDate =
			operation === 'Plus'
				? add(new Date(), durations)
				: sub(new Date(), durations);

		return format(finalDate, 'yyyy-MM-dd');
	}

	// dateMinus1day(global_someDate)
	if (valueSrc.startsWith('datePlus') || valueSrc.startsWith('dateMinus')) {
		const operation = valueSrc.startsWith('datePlus') ? 'Plus' : 'Minus';

		const extractDateBetweenParenthesis = () => {
			// Regular expression to match content inside parentheses
			const regex = /\(([^()]*)\)/g;

			let matches = [];
			let match;
			while ((match = regex.exec(valueSrc)) !== null) {
				matches.push(match[1]);
			}

			return matches[0];
		};

		const maybeDate = extractDateBetweenParenthesis(); // global_someDate
		const dateSrc = maybeDate.startsWith('global_')
			? StateManager.get(maybeDate.replace('global_', ''))
			: maybeDate;

		const date = DateTime.toGlobal(dateSrc);

		const durationString = valueSrc
			.replace('date' + operation, '')
			.split('(')[0];

		const durations = getDurations(durationString);
		const finalDate =
			operation === 'Plus'
				? add(new Date(date), durations)
				: sub(new Date(date), durations);

		return format(finalDate, 'yyyy-MM-dd');
	}

	return valueSrc;
};
