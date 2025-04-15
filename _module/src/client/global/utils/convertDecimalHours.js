export function convertDecimalHours(decimalHours) {
	const _hours = Math.floor(decimalHours);
	const decimalMinutes = (decimalHours - _hours) * 60;
	const _minutes = Math.floor(decimalMinutes);
	const _seconds = Math.round((decimalMinutes - _minutes) * 60);

	return {
		hours: _hours,
		minutes: _minutes,
		seconds: _seconds,
	};
}
