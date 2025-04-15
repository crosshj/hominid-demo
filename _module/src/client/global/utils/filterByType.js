export const filterByType = (context) => (type) => {
	return context.filter((item) => item.type === type);
};
