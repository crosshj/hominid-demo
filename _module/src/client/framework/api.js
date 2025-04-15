import { parse } from 'graphql/language/parser.js';
import { print } from 'graphql/language/printer.js';
//import { dump } from 'js-yaml';

const extractOperationName = (document) => {
	let operationName = undefined;
	const operationDefinitions = document.definitions.filter(
		(definition) => definition.kind === `OperationDefinition`,
	);
	if (operationDefinitions.length === 1) {
		operationName = operationDefinitions[0]?.name?.value;
	}
	return operationName;
};

export const resolveRequestDocument = (document) => {
	if (typeof document === `string`) {
		let operationName = undefined;
		try {
			const parsedDocument = parse(document);
			operationName = extractOperationName(parsedDocument);
		} catch (err) {}
		return { query: document, operationName };
	}
	const operationName = extractOperationName(document);
	return { query: print(document), operationName };
};

export const graphQLClient = {
	request: async (...args) => {
		try {
			const [args0, variables, ...argsRest] = args;
			const { tag, ...variablesRest } = variables || {};
			const queryParams = typeof tag !== 'undefined' ? `?${tag}` : '';
			const url = `/api/graphql${queryParams}`;
			const { query, operationName } = resolveRequestDocument(args0);

			if (Array.isArray(variables?.input)) {
				for (const i of variables.input) {
					if (!i?.args) continue;
					try {
						i.args = JSON.parse(i.args);
					} catch (e) {}
				}
			}
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						operationName,
						variables: variablesRest,
						...argsRest,
					},
					null,
					2,
				),
			};
			const result = await fetch(url, options);
			let { data, error, message = '' } = await result.json();
			// AWS does not return graphql-formatted errors
			if (
				message.toLowerCase().includes('error') &&
				typeof error === 'undefined'
			) {
				error = message;
			}
			return { ...data, error };
		} catch (error) {
			console.info(error);
			return { error };
		}
	},
};
