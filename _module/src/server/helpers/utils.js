function tryParse(input, defaultOut) {
	try {
		return JSON.parse(input);
	} catch (e) {
		return defaultOut;
	}
}

const unique = (arr) =>
	Array.from(new Set(arr.map(JSON.stringify))).map(JSON.parse);

const pipe =
	(...fns) =>
	async (x) => {
		let result = x;
		for (var fn of fns) {
			result = await fn(result);
		}
		return result;
	};

const isDefined = (value) =>
	value !== 'undefined' &&
	value !== undefined &&
	value !== 'null' &&
	value !== null;

module.exports = {
	isDefined,
	pipe,
	tryParse,
	unique,
};
