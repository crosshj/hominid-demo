export const clone = (objectToClone) => {
	try {
		if (typeof structuredClone !== 'undefined') {
			return structuredClone(objectToClone);
		}
	} catch (e) {
		// console.log({
		// 	_: 'clone with structuredClone',
		// 	e,
		// 	objectToClone,
		// });
	}

	try {
		return JSON.parse(JSON.stringify(objectToClone));
	} catch (e) {
		// console.log({
		// 	_: 'clone with JSON stringify/parse',
		// 	e,
		// 	objectToClone,
		// });
	}

	return objectToClone;
};
