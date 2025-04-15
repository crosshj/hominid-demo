export const iCompare = (a = '', b = '') => a.toLowerCase() === b.toLowerCase();

export const SnakeCase = (inputString) => {
	if (typeof inputString === 'undefined') return;
	const isSnakeCase = (str) => str.includes('_');
	const camelToSnakeCase = (s) =>
		s
			.split(/(?=[A-Z])/)
			.join('_')
			.toLowerCase();
	return isSnakeCase(inputString)
		? inputString
		: camelToSnakeCase(inputString);
};

export const addSpacesToCamelCase = (input) => {
	return input.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const dedent = (indented) => {
	const lines = indented.split('\n');
	// TODO: test which is faster
	//const [indent] = indented.match(/^\s*/g) || [''];
	//const dedented = lines.map((x) => x.replace(new RegExp('^' + indent), ''));
	const indent = indented.length - indented.trimStart().length;
	const dedented = lines.map((x) => x.slice(indent));
	return dedented.join('\n');
};
