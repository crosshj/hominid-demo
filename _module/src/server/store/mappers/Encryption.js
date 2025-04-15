const Crypto = require('../../helpers/crypto');

let helper;

const tryParse = (string) => {
	try {
		return JSON.parse(string);
	} catch (e) {}
};

const processLineItem = (response) => {
	const decrypt = helper.decryptDesperate;
	const decryptedResponse = {};
	for (const key of Object.keys(response)) {
		if (!key.endsWith('_Encrypted')) {
			decryptedResponse[key] = response[key];
			continue;
		}
		const decryptedKey = key.replace('_Encrypted', '');
		try {
			decryptedResponse[decryptedKey] = decrypt(
				Buffer.from(response[key], 'base64')
			);
		} catch (e) {
			decryptedResponse[decryptedKey] = '';
		}
	}
	return decryptedResponse;
};

exports.decryptResults = (resultsResponse, opts) => {
	try {
		helper = new Crypto(opts);
		const decryptedResponse = [];
		for (const i of Object.keys(resultsResponse)) {
			const { results } = resultsResponse[i];
			let resultsParsed = tryParse(results);
			if (!resultsParsed || !Array.isArray(resultsParsed)) {
				decryptedResponse.push(resultsResponse[i]);
				continue;
			}
			resultsParsed = resultsParsed.map(processLineItem);
			decryptedResponse.push({
				...resultsResponse[i],
				results: JSON.stringify(resultsParsed),
			});
		}
		return decryptedResponse;
	} catch (e) {
		console.error(e);
	}
	return resultsResponse;
};
