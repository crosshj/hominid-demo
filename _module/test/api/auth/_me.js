//const { sign } = require('jsonwebtoken');
const fetch = require('node-fetch');
//const jwt_decode = require('jwt-decode');
const { Cookie } = require('../_utils');
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const sessionQuery = `
query getSession($input: SessionInput) {
	Session(input: $input) {
		email
		firstName
		lastName
		token
	}
}`.trim();

const getProfile = (token) => {
	if (!token) return;
	const url = `https://${process.env.AUTH0_DOMAIN}/userinfo`;
	const options = {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + token },
	};
	return fetch(url, options).then((x) => x.json());
};

const getSession = ({ sub, name: email }) => {
	const id = sub.split('auth0|').pop();
	const options = {
		method: 'POST',
		body: JSON.stringify({
			query: sessionQuery,
			variables: {
				input: { email, id },
			},
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	};
	return fetch(API_URL, options).then((x) => x.json());
};

module.exports = (cache) => async (req, res) => {
	try {
		//TODO: handle if accessToken is expired
		const { sessionExpires } = req.cookies;
		// const decoded = jwt_decode(req.cookies.accessToken);
		// console.log(JSON.stringify({ decoded }, null, 2));
		const user = {
			//id: decoded['https://greenfield.com/identity/uuid'],
			//roles: decoded['https://greenfield.com/claims/roles'],
			//email: decoded['https://greenfield.com/identity/email'],
		};
		const profile = await getProfile(req.cookies.accessToken);
		const session = await getSession(profile);
		const { token } = session?.data?.Session || {};
		const { nickname, picture } = profile || {};
		user.name = nickname || (user.email || '').split('@')[0];
		user.picture = picture;
		res.setHeader('Set-Cookie', [
			Cookie({
				token,
				Expires: new Date(Date.now() + 86400 * 1000),
				Path: '/',
				HttpOnly: true,
			}),
		]);
		return res.json(user);
	} catch (e) {
		res.setHeader('Set-Cookie', [
			Cookie({
				accessToken: `deleted`,
				'Max-Age': -1,
				Path: '/api/',
				HttpOnly: true,
			}),
			Cookie({
				accessToken: `deleted`,
				'Max-Age': -1,
				Path: '/',
				HttpOnly: true,
			}),
		]);
		return res.json(false);
	}
};
