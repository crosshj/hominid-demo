import { formatDate } from '../utils';

export const generateWeeks = (amount) => {
	const dates = [];

	for (let index = 0; index < amount; index++) {
		const today = new Date();
		const helper = 6 * index;
		today.setDate(today.getDate() - helper);
		const weekDay = today.getDay();
		const diff = today.getDate() - weekDay + (weekDay === 0 ? -6 : 1);
		const startDay = new Date(today.setDate(diff));
		const endDay = new Date(startDay);
		endDay.setDate(endDay.getDate() + 6);

		dates[index] = {
			start: formatDate(startDay),
			end: formatDate(endDay),
			id: index,
		};
	}

	return dates;
};
