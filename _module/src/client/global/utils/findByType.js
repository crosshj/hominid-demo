export const findByType = (context) => (type) => {
	return context.find((item) => item.type === type);
};
