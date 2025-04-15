const formatMap = {
	cash: (s) => `$${Math.round(s).toFixed(2)}`,
};

export const getFormatFunction = (format) => {
	return formatMap[format] || null;
};
