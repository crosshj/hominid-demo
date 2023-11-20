const fetch = require('node-fetch');
const { Cookie, base64 } = require('../_utils');

const FormDataBody = (formData) => {
	return Object.entries(formData)
		.map(([k, v]) => `${k}=${v}`)
		.join('&');
};

const getAuth = (code) => {
	if (!code) throw new Error('Authorization code missing.');

	const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
	const options = {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'Cache-Control': 'no-cache',
		},
		body: FormDataBody({
			grant_type: 'authorization_code',
			client_id: process.env.AUTH0_CLIENT_ID,
			client_secret: process.env.AUTH0_CLIENT_SECRET,
			code,
			redirect_uri: `${process.env.REACT_APP_BASE_URL}/api/auth/callback`,
		}),
	};
	return fetch(url, options).then((x) => x.json());
};

const handleInvite = async ({ session, auth }) => {
	try {
		const { API_URL, AUTH0_DOMAIN } = process.env;
		const { invite } = session;
		if (typeof invite === 'undefined') return;

		const url = `https://${AUTH0_DOMAIN}/userinfo`;
		const auth0ProfileOpts = {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + auth.access_token },
		};
		const profile = await fetch(url, auth0ProfileOpts).then((x) =>
			x.json(),
		);
		const auth0id = (profile?.sub || '').split('auth0|').pop();

		const dbSessionOpts = {
			method: 'POST',
			body: JSON.stringify({
				query: `
				query getSession($input: SessionInput) {
					Session(input: $input) {
						email
						firstName
						lastName
						token
					}
				}
			`
					.trim()
					.replace(/\t\t\t\t/g, ''),
				variables: {
					input: { id: auth0id, invite },
				},
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await fetch(API_URL, dbSessionOpts).then((x) => x.json());
	} catch (e) {
		console.error('Something broke when trying to handle invite');
		console.error(e);
	}
};

module.exports = (cache) => async (req, res) => {
	let returnTo = '/';
	try {
		const {
			state: sessionKey,
			code,
			error,
			error_description,
		} = req?.query || {};

		if (error) throw new Error(error + ': ' + error_description);

		const session = sessionKey ? JSON.parse(base64.decode(sessionKey)) : {};
		const { returnTo = '/' } = session;

		const auth = await getAuth(code);

		if (!auth?.access_token) throw new Error('Access token missing.');

		await handleInvite({ session, auth });

		const expires = auth.expires_in || 86400;
		res.setHeader('Set-Cookie', [
			Cookie({
				accessToken: `${auth.access_token}`,
				Expires: new Date(Date.now() + expires * 1000),
				Path: '/',
				HttpOnly: true,
			}),
			Cookie({
				sessionExpires: expires,
				Expires: new Date(Date.now() + expires * 1000),
				Path: '/',
				HttpOnly: false,
			}),
		]);
		return res.redirect(returnTo);
	} catch (e) {
		console.log(e);
		res.setHeader('Set-Cookie', [
			Cookie({
				accessToken: ``,
				Expires: Date.now(),
				Path: '/',
				HttpOnly: true,
			}),
		]);
		return res.redirect(returnTo);
	}
};
