const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

dayjs.prototype.ceil = function (inc) {
	let ceil = this.set('second', 0);
	ceil = ceil.set('ms', 0);
	while (ceil.minute() % inc !== 0) {
		ceil = ceil.add(1, 'minute');
	}
	return ceil;
};

dayjs.prototype.floor = function (inc) {
	let floor = this.set('second', 0);
	floor = floor.set('ms', 0);
	while (floor.minute() % inc !== 0) {
		floor = floor.subtract(1, 'minute');
	}
	return floor;
};

dayjs.prototype.inRange = function (start, end) {
	const dt = this;
	const isSameStart = dt.isSame(start, 'minute');
	const isSameEnd = dt.isSame(end, 'minute');
	const isBetween = dt.isAfter(start, 'minute') && dt.isBefore(end, 'minute');
	return isSameStart || isSameEnd || isBetween;
};

module.exports = dayjs;
