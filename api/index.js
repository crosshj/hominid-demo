const { readFileSync } = require('fs');
const localServer = require('../server/server');
const aiHandler = require('./ai/index.js');

const DEFAULT_TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImN0IiwiZW1haWwiOiJhdHdvcmtyb2xlK2NoaWxkQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNoaWxkIiwibGFzdE5hbWUiOiJUZW5hbnQiLCJicmFuY2hJZCI6MSwicm9sZUlkIjo1LCJ0ZW5hbnRJZCI6MX0.4cu0yJYvMvzW50aRGwAKEzNK7YqCHBvdF-nZ9CwUxh8';

const graphqlRequest = async (req, res) => {
	try {
		// const token = req?.cookies?.token;
		// const accessToken = req?.cookies?.accessToken;
		const accessToken = process.env.TEST_TOKEN || DEFAULT_TOKEN;
		const token = process.env.TEST_TOKEN || DEFAULT_TOKEN;
		const { operationName, variables } = req?.body;
		const {
			input: [{ args, name }],
		} = variables;

		if (
			name !== 'ui.sp_UIContextGetComponentsByUserID' &&
			args?.key.startsWith('ai')
		) {
			return aiHandler(req, res);
		}

		if (
			name === 'ui.sp_GetData' &&
			args?.key === "ui.sp_UIContextGetComponentsByUserID" &&
			args?.fragment
		) {
			const defaultRes = {
				"data": {
					"Data": [
						{
							"cacheExpires": null,
							"name": "ui.sp_GetData",
							"uuid": "ad89a541-bdf0-40b0-bfb2-35b1a5ecd077",
							"results": JSON.stringify([
								{
									"parent": "",
									"key": "Page",
									"label": "",
									"type": "Page",
									"target": "",
									"default": "",
									"value": "",
									"order": 1,
									"properties": ""
								},
								{
									"parent": "Page",
									"key": "Page.Typography",
									"label": "",
									"type": "Typography",
									"target": "",
									"default": "",
									"value": "",
									"order": 101,
									"properties": `textContent:${args.fragment}`
								}
							])
						}
					]
				}
			};
			res.statusCode = 200;
			return res.json(defaultRes);
		}

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
		const localOpts = {
			...options,
			headers: {
				...options.headers,
				...req.headers,
			},
		};
		const { headers, statusCode, body } = await localServer.query(
			localOpts
		);
		for (const [name, value] of Object.entries(headers)) {
			res.setHeader(name, value);
		}
		res.statusCode = statusCode;
		res.json(JSON.parse(body));
		return;
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message, stack: e.stack });
	}
};

module.exports = (req, res) => {
	console.log(`REQ: ${req.url}`);
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
