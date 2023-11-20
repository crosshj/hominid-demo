const { Cookie, ParamString } = require('../_utils');
const { base64 } = require('../_utils');

module.exports = (cache) => (req, res) => {
	const stateObject = {
		returnTo: req.query?.returnTo || '/',
	};
	if (typeof req.query?.invite !== 'undefined') {
		stateObject.invite = req.query.invite;
	}
	const state = base64.encode(JSON.stringify(stateObject));

	const params = ParamString({
		response_type: 'code',
		scope: 'openid profile api',
		client_id: process.env.AUTH0_CLIENT_ID,
		redirect_uri: `${process.env.REACT_APP_BASE_URL}/api/auth/callback`,
		screen_hint: 'signup',
		state,
	});

	const loginUrl = `https://${process.env.AUTH0_DOMAIN}/authorize?${params}`;
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
	return res.redirect(loginUrl);
};
