import { format, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import _ from 'lodash';

const getTimeZone = (timeZoneSrc = '') => {
	if (!_.isString(timeZoneSrc) || _.isEmpty(timeZoneSrc)) {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	}
	return timeZoneSrc;
};

const parseDate = (dateIn = '', timeZoneSrc) => {
	try {
		const tz = getTimeZone(timeZoneSrc);

		if (_.isString(dateIn) && dateIn.endsWith('Z')) {
			return { date: dateIn, tz };
		}

		const utcDate = zonedTimeToUtc(dateIn, tz);
		const isoUtcDate = utcDate.toISOString();

		return { date: isoUtcDate, tz };
	} catch (e) {
		console.log(e);
		return { date: dateIn, tz: '' };
	}
};

// assume Zulu/UTC time is actually in current TimeZone
// OR reverse assumption
let useAssumption = true;
const assume = (value, reverse) => {
	if (!useAssumption) return value;
	//TODO: return value in form it is sent (date vs string)
	let currentTZOffset = new Date(value).getTimezoneOffset() / 60;
	if (reverse) {
		currentTZOffset * -1;
	}
	const hoursDiff =
		(currentTZOffset < 0
			? '+' + (Math.abs(currentTZOffset) + '').padStart(2, '0')
			: '-' + (currentTZOffset + '').padStart(2, '0')) + '00';
	const valueAsCurrentTimezone = value.replace(/Z$/, hoursDiff);
	return valueAsCurrentTimezone;
};

export const DateTime = {
	setAssume: (shouldAssume) => {
		useAssumption = shouldAssume;
	},
	assume,
	toGlobal: (dateSrc, timeZoneSrc = '') => {
		const { date } = parseDate(assume(dateSrc, 'reverse'), timeZoneSrc);
		return date;
	},
	toLocal: (dateSrc, timeZoneSrc = '', opts = {}) => {
		const thisDate = opts.assume !== false ? assume(dateSrc) : dateSrc;
		const { date, tz } = parseDate(thisDate, timeZoneSrc);

		const utcZonedDate = utcToZonedTime(date, tz);
		const localDate = format(new Date(utcZonedDate), "yyyy-MM-dd'T'HH:mm");

		return localDate;
	},
};
