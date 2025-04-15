const obscureData = (data, obscureOption) => {
	if (typeof data !== 'string' && typeof data !== 'number') {
		return data;
	}

	const dataStr = String(data);

	const obscure = (str, visibleChars) => {
		let result = '';
		for (let i = 0; i < str.length; i++) {
			if (str[i] === '-') {
				result += '-';
			} else if (i < str.length - visibleChars) {
				result += '●';
			} else {
				result += str[i];
			}
		}
		return result;
	};

	switch (obscureOption) {
		case true:
			return obscure(dataStr, 0);
		case false:
			return dataStr;
		case 'last4':
			return obscure(dataStr, 4);
		default:
			return dataStr;
	}
};

export default obscureData;
