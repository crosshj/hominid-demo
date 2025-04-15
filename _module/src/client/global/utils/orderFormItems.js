export const orderFormItems = (a, b) => {
	if (a?.sectionOrder === b?.sectionOrder) {
		return a?.tabOrder - b?.tabOrder;
	}
	return a?.sectionOrder - b?.sectionOrder;
};
