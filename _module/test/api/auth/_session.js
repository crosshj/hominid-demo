const Crypto = require('crypto');
const { base64 } = require('../_utils');

function createRandomString(size = 21) {
	return Crypto.randomBytes(size).toString('base64').slice(0, size);
}

class Cache {
	constructor() {
		this.cache = new Map();
	}

	create(session) {
		const newKey = base64.encode(createRandomString());
		this.set(newKey, session);
		return newKey;
	}

	set(key, session) {
		this.cache.set(key, session);
	}

	get(key) {
		return this.cache.get(key);
	}
}

module.exports = { Cache };
