export const getLastIdElement = (id) => {
	if (!id) return id;
	return id?.split('.')?.pop() || id;
};
