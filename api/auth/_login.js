const { ParamString } = require('../_utils');
const { base64 } = require('../_utils');

module.exports = (cache) => (req, res) => {
	const state = base64.encode(
		JSON.stringify({
			returnTo: req.query?.returnTo || '/',
		})
	);

	const params = ParamString({
		response_type: 'code',
		scope: 'openid profile api',
		client_id: process.env.AUTH0_CLIENT_ID,
		redirect_uri: `${process.env.REACT_APP_BASE_URL}/api/auth/callback`,
		screen_hint: 'signin',
		state,
	});

	const loginUrl = `https://${process.env.AUTH0_DOMAIN}/authorize?${params}`;

	return res.redirect(loginUrl);
};
