export const getLongDate = (target) => {
	const targetDate = new Date(target);
	const day = targetDate.getDate();
	const month = targetDate.toLocaleString('en-US', { month: 'long' });
	const weekDay = targetDate.toLocaleString('en-US', { weekday: 'long' });

	const dayOrdinalNumber = (number) => {
		return number > 0
			? number +
					['th', 'st', 'nd', 'rd'][
						(number > 3 && number < 21) || number % 10 > 3
							? 0
							: number % 10
					]
			: '';
	};

	return `${weekDay}, ${month} ${dayOrdinalNumber(day)}`;
};
