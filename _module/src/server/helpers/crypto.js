const crypto = require('crypto');
const rijndael = require('rijndael-js');
var base64 = require('base64-js');

function encrypt(text) {
	var cipher = crypto.createCipheriv(algorithm, key, iv);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text) {
	const { algorithm, key, iv } = this;
	var decipher = crypto.createDecipheriv(algorithm, key, iv);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function decryptMS(text) {
	const { key: keySrc, iv: ivSrc } = this;

	const key = Array.isArray(keySrc)
		? Buffer.from(key)
		: Buffer.from(keySrc, 'base64');

	const iv = Array.isArray(ivSrc)
		? Buffer.from(ivSrc)
		: Buffer.from(ivSrc, 'base64');

	const cipher = new rijndael(key, 'cbc');
	const decrypted = cipher.decrypt(text, 16, iv);
	const plaintext = Buffer.from(decrypted, 'utf8');
	return plaintext.toString().replace(/\x00/g, '').trim();
}

function decryptDesperate(text, cipherText) {
	const { key, iv } = this;
	const allAlgos = crypto.getCiphers();
	const allHashes = crypto.getHashes();

	let dec;
	for (const algorithm of allAlgos) {
		for (const hash of allHashes) {
			const gennedKey = crypto.createHash(hash).update(key).digest('hex');
			try {
				const decipher = crypto.createDecipheriv(algorithm, key, iv);
				dec = decipher.update(text, 'hex', 'utf8');
				dec += decipher.final('utf8');
				//console.log({ text, dec });
			} catch (e) {}
		}
	}
	return dec || 'not found';
}

const PasswordDeriveBytes = (
	password,
	salt,
	iterations = 100,
	hash = 'SHA1',
	len
) => {
	return deriveBytesFromPassword(
		password,
		salt, //Buffer.from(salt, 'utf-8'),
		iterations,
		hash,
		len
	);

	// let key = Buffer.concat([Buffer(password), Buffer(salt)]);
	// for (let i = 0; i < iterations; i++) {
	// 	key = crypto.createHash(hash).update(key).digest();
	// }
	// if (key.length < len) {
	// 	const hx = PasswordDeriveBytes(password, salt, 1, hash);
	// 	let counter = 0;
	// 	while (key.length < len) {
	// 		counter++;
	// 		let extendedHash = Buffer.concat([Buffer(counter.toString()), hx]);
	// 		key = Buffer.concat([
	// 			key,
	// 			crypto.createHash(hash).update(extendedHash).digest(),
	// 		]);
	// 		//console.log(key.toString());
	// 	}
	// 	return key.slice(0, len);
	// }
	// return key.slice(0, len);
};

function deriveBytesFromPassword(
	password,
	salt,
	iterations,
	hashAlgorithm,
	keyLength
) {
	if (keyLength < 1) throw new Error('keyLength must be greater than 1');
	if (iterations < 2) throw new Error('iterations must be greater than 2');

	const passwordWithSalt = Buffer.concat([
		Buffer.from(password, 'utf-8'),
		salt,
	]);
	const hashMissingLastIteration = hashKeyNTimes(
		passwordWithSalt,
		iterations - 1,
		hashAlgorithm
	);
	let result = hashKeyNTimes(hashMissingLastIteration, 1, hashAlgorithm);
	result = extendResultIfNeeded(
		result,
		keyLength,
		hashMissingLastIteration,
		hashAlgorithm
	);

	return result.slice(0, keyLength);
}

function hashKeyNTimes(key, times, hashAlgorithm) {
	let result = key;
	for (let i = 0; i < times; i++) {
		result = crypto.createHash(hashAlgorithm).update(result).digest();
	}
	return result;
}

function extendResultIfNeeded(
	result,
	keyLength,
	hashMissingLastIteration,
	hashAlgorithm
) {
	let counter = 1;
	while (result.length < keyLength) {
		result = Buffer.concat([
			result,
			calculateSpecialMicrosoftHash(
				hashMissingLastIteration,
				counter,
				hashAlgorithm
			),
		]);
		counter++;
	}
	return result;
}

function calculateSpecialMicrosoftHash(
	hashMissingLastIteration,
	counter,
	hashAlgorithm
) {
	// Here comes the magic: Convert an integer that increases from call to call to a string
	// and convert that string to utf-8 bytes. These bytes are than used to slightly modify a given base-hash.
	// The modified hash is than piped through the hash algorithm.
	// Note: The PasswordDeriveBytes algorithm converts each character to utf-16 and then drops the second byte.
	const prefixCalculatedByCounter = Buffer.from(counter.toString(), 'utf-8');
	const inputForAdditionalHashIteration = Buffer.concat([
		prefixCalculatedByCounter,
		hashMissingLastIteration,
	]);
	return crypto
		.createHash(hashAlgorithm)
		.update(inputForAdditionalHashIteration)
		.digest();
}

function createToken() {
	const secret = Math.random();
	const hash = crypto
		.createHash('sha256', secret + '')
		.update(Math.random() + '')
		.digest('hex');
	return hash;
}

class Crypto {
	constructor({ algorithm, key, iv } = {}) {
		this.algorithm = algorithm || 'aes-256-ctr';
		this.key = key || process.env.DB_ENCRYPTION_KEY;
		this.iv = iv || process.env.DB_ENCRYPTION_IV;
		this.encrypt = encrypt.bind(this);
		this.decrypt = decrypt.bind(this);
		this.decryptDesperate = decryptMS.bind(this);
		this.createToken = createToken.bind(this);
	}
}
Crypto.PasswordDeriveBytes = PasswordDeriveBytes;

module.exports = Crypto;
