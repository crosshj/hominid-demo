require('dotenv').config();
const auth0 = require('./auth0');
const jwt = require('jsonwebtoken');

const Authorization = 'Bearer ...';

const verifyToken = (token) => {
	jwt.verify(token, process.env.AUTHO_CLIENT_SECRET, function (err, decoded) {
		console.info(err, decoded);
	});
};

(async () => {
	// await auth0.getUser({
	// 	headers: { Authorization },
	// })

	const token = Authorization.replace(/^Bearer /, '');
	verifyToken(token);
})();
