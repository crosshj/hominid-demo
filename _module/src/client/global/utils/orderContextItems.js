export const orderContextItems = (a, b) => {
	if (!a?.order || !b?.order) return 0;
	return a?.order - b?.order;
};
