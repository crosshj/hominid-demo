import dotenv from 'dotenv';
import { readFileSync } from 'fs';
dotenv.config();

const GRAPHQL_API = 'http://localhost:80/graphql';
export const graphqlGeneric = async (req) => {
	try {
		const { operationName, variables } = req?.body;

		//TODO: connect auth0 handling (until then just copy it from dev environment)
		//const token = req?.cookies?.token;
		const token = process.env.TEST_TOKEN;

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

		const schemaPath = `${__dirname}/graphql/schemas/${operationName}.gql`;
		const query = readFileSync(schemaPath, 'utf-8');

		const options = {
			method: 'POST',
			body: JSON.stringify({
				query,
				operationName,
				variables: {
					...variables,
					input: Array.isArray(variables.input)
						? variables.input.map(newInput)
						: newInput(variables.input),
				},
			}),

			headers: {
				'Content-Type': 'application/json',
			},
		};
		const result = await fetch(GRAPHQL_API, options).then((x) => x.json());
		return JSON.stringify(result);
	} catch (e) {
		console.log(e);
	}
};
