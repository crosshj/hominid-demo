/*
    ignore xmldom missed value warnings
*/
const WithModdedConsole =
	(fn) =>
	(...args) => {
		//const consoleLogBak = console.log;
		const consoleWarnBak = console.warn;

		const altLog =
			(backupLog) =>
			(...args) => {
				const ignoreMissedValueWarning = args.find(
					(x) =>
						typeof x === 'string' &&
						x.includes('[xmldom') &&
						x.includes('missed value!!')
				);
				if (ignoreMissedValueWarning) {
					return;
				}
				return backupLog(...args);
			};
		console.warn = altLog(consoleWarnBak);
		//console.log = altLog(consoleLogBak);

		const result = fn(...args);

		//console.log = consoleLogBak;
		console.warn = consoleWarnBak;
		return result;
	};

module.exports = { WithModdedConsole };
