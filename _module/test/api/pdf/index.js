const fetch = require('node-fetch');

const API_URL = process.env.API_URL;

module.exports = async (req, res) => {
	if (!req?.method === 'GET')
		return res.status(400).json({ error: 'method not supported' });
	if (!req?.cookies?.accessToken)
		return res.status(400).json({ error: 'not authorized' });

	try {
		const options = {
			method: 'GET',
			headers: {},
		};
		const PDFUrl =
			API_URL.replace('/graphql', '/pdf') + req.url.replace('/pdf', '');
		//console.log({ PDFUrl, API_URL, url: req.url });

		const apiRes = await fetch(PDFUrl, options);

		for (const [key, value] of apiRes.headers.entries()) {
			res.setHeader(key, value);
		}
		apiRes.body.pipe(res);
	} catch (e) {
		res.status(500).json({ error: e.message, stack: e.stack });
	}
};
