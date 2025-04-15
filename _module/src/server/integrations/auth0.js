const cache = {};
//TODO: expire cache

const { AUTH0_DOMAIN } = process.env;

const getProfile = async (authHeader) => {
	if (!AUTH0_DOMAIN) return;
	if (!authHeader) return;

	if (cache[authHeader]) {
		return cache[authHeader];
	}
	const fetch = (await import('node-fetch')).default;
	const headers = {
		Authorization: authHeader,
		'Content-Type': 'application/json',
	};
	const url = `https://${AUTH0_DOMAIN}/userinfo`;
	const opts = { headers };
	const responseText = await fetch(url, opts).then((x) => x.text());
	try {
		const profile = JSON.parse(responseText);
		if (!profile || profile.error) return;
		cache[authHeader] = profile;
		return profile;
	} catch (e) {
		return;
	}
};

const getUser = async (event) => {
	const { body, headers } = event;

	return await getProfile(headers?.Authorization);
};

module.exports = { getUser };
