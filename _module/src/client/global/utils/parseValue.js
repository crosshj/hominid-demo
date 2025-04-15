import JSON5 from 'json5';

const parseValue = (value) => {
	try {
		return JSON5.parse(value);
	} catch (e) {
		//console.warn(e);
		return value;
	}
};

export default parseValue;
