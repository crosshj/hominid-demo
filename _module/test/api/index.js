const { readFileSync } = require('fs');
const fetch = require('node-fetch');
console.time('load server');
const localServer = require('../server/server');
console.timeEnd('load server');
//const API_URL = process.env.API_URL;
//const API_KEY = process.env.API_KEY;

const GRAPHQL_API = 'http://localhost:80/graphql';
const graphqlRequest = async (req, res) => {
	try {
		const token = req?.cookies?.token;
		const accessToken = req?.cookies?.accessToken;
		const { operationName, variables } = req?.body;

		const newInput = (input) => {
			if (!input) return input;
			const { args = '', ...i } = input;
			return {
				args: JSON.stringify({
					...args,
					token,
				}),
				...i,
			};
		};
		const schemaPath = `${__dirname}/schemas/${operationName}.gql`;
		const query = readFileSync(schemaPath, 'utf-8');

		const options = {
			method: 'POST',
			body: JSON.stringify({
				operationName,
				query,
				variables: {
					...variables,
					input: Array.isArray(variables.input)
						? variables.input.map(newInput)
						: newInput(variables.input),
				},
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + accessToken,
			},
		};

		if (process.env.ISLOCAL + '' === 'true') {
			const { headers, statusCode, body } = await localServer.query({
				...options,
				headers: {
					...options.headers,
					...req.headers,
				},
			});
			for (const [name, value] of Object.entries(headers)) {
				res.setHeader(name, value);
			}
			res.statusCode = statusCode;
			res.json(JSON.parse(body));

			return;
		}
		const response = await fetch(GRAPHQL_API, options).then((x) =>
			x.json(),
		);
		return res.json(response);
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message, stack: e.stack });
	}
};

module.exports = (req, res) => {
	console.log(`REQ: ${req.url}`);
	//console.log(JSON.stringify(req.headers));

	try {
		if (req.url.startsWith('/api/graphql')) {
			console.time('process request');
			graphqlRequest(req, res);
			console.timeEnd('process request');
			return;
		}
		res.json({});
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message, stack: e.stack });
	}
};
