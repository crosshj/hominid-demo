const colorsList = ['green1', 'green2', 'green3', 'green4'];

export const colorMap = (color = 'default') =>
	({
		red: 'error',
		orange: 'warningDark',
		blue: 'info',
		yellow: 'warning',
		green: 'success',
		default: 'default',
	}[color.toLowerCase()] || color);

export const getColor = (itemIndex) => {
	let index = itemIndex - 1;
	for (let i = 4; i > 0; i--) {
		if (index % i === 0) {
			return colorsList[itemIndex];
		}
	}
};
