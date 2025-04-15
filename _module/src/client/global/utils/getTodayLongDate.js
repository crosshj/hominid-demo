export const getTodayLongDate = () => {
	const today = new Date();
	const day = today.getDate();
	const month = today.toLocaleString('en-US', { month: 'long' });
	const weekDay = today.toLocaleString('en-US', { weekday: 'long' });

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
