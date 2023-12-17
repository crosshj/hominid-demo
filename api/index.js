const { readFileSync } = require('fs');
const localServer = require('../server/server');
const aiHandler = require('./ai/index.js');
const { lorem } = require('./_utils.js');

const DEFAULT_TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImN0IiwiZW1haWwiOiJhdHdvcmtyb2xlK2NoaWxkQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkNoaWxkIiwibGFzdE5hbWUiOiJUZW5hbnQiLCJicmFuY2hJZCI6MSwicm9sZUlkIjo1LCJ0ZW5hbnRJZCI6MX0.4cu0yJYvMvzW50aRGwAKEzNK7YqCHBvdF-nZ9CwUxh8';

const ContextAsData = (body) => {
	const newBody = body
		.replace(/ContextProc/gm, 'Data')
		.replace(/ui.sp_UIContextGetComponentsByUserID/gm, 'ui.sp_GetData');
	const parsedBody = JSON.parse(newBody);
	parsedBody.data.Data.forEach(
		(x) => (x.results = JSON.stringify(x.results))
	);
	return parsedBody;
};

const graphqlRequest = async (req, res) => {
	try {
		// const token = req?.cookies?.token;
		// const accessToken = req?.cookies?.accessToken;
		const accessToken = process.env.TEST_TOKEN || DEFAULT_TOKEN;
		const token = process.env.TEST_TOKEN || DEFAULT_TOKEN;
		let { operationName, variables } = req?.body;
		let {
			input: [{ args, name, uuid }],
		} = variables;
		let { fragment, fragmentPrefix } = args;
		fragment = fragment ? `${fragmentPrefix || ''}${fragment}` : undefined;
		delete args.fragment;
		delete args.fragmentPrefix;

		if (args?.key === 'contextFragment') {
			operationName = 'getContext';
			name = 'ui.sp_UIContextGetComponentsByUserID';
			args.key = fragment;
			// console.log({ fragment });
			variables.input[0].args = args;
			variables.input[0].name = name;
		}

		if (
			name !== 'ui.sp_UIContextGetComponentsByUserID' &&
			args?.key.startsWith('ai')
		) {
			return aiHandler(req, res);
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
		let { headers, statusCode, body } = await localServer.query(localOpts);
		for (const [name, value] of Object.entries(headers)) {
			res.setHeader(name, value);
		}
		res.statusCode = statusCode;
		const parsedBody = fragment ? ContextAsData(body) : JSON.parse(body);
		res.json(parsedBody);
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
