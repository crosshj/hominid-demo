const COLOR = (colorCode) => (str) => {
	if (process.env.ISLOCAL !== 'true') return str;
	return `\x1b[${colorCode}m${str}\x1b[0m`;
};

module.exports = {
	grey: COLOR(30),
	red: COLOR(31),
	green: COLOR(32),
	yellow: COLOR(33),
	blue: COLOR(34),
	purple: COLOR(35),
	teal: COLOR(36),
};
