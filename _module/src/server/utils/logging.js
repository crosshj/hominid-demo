const logLocal = (args) => {
	if (process.env.ISLOCAL === 'true') {
		console.log(Object.values(args));
	}
};
const log = (args) => {
	console.log(Object.values(args));
};
const warn = (args) => {
	console.warn(Object.values(args));
};

const getLoggerWithPath = (__path) => ({
	log: (...args) => log({ _: __path, ...args }),
	warn: (...args) => warn({ _: __path, ...args }),
	logLocal: (...args) => logLocal({ _: __path, ...args }),
});

module.exports = {
	getLoggerWithPath,
	log,
	warn,
	logLocal,
};
