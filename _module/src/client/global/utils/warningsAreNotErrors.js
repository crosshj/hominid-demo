/*
this is an aweful way to fix an annoying React issue
see https://github.com/facebook/react/issues/5632
*/

const errorsToWarn = ['Warning:'];
const oldConsError = console.error;
console.error = function (...args) {
	let toWarn = false;
	if (typeof args[0] === 'string') {
		errorsToWarn.forEach(function (_s) {
			if (args[0].startsWith(_s)) {
				toWarn = true;
			}
		});
	}
	toWarn ? console.warn(...args) : oldConsError(...args);
};
