const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadSchemaSync } = require('@graphql-tools/load');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { graphql } = require('graphql');

const { tryParse } = require('./helpers/utils');
const DB = require('./integrations/database');
const auth0 = require('./integrations/auth0');
const userStore = require('./store/user');
const getMocks = require('./uimocks');

const resolvers = {
	Query: {
		ContextProc: require('./resolvers/ContextProc').query,
		Data: require('./resolvers/Data').query,
		ListProc: require('./resolvers/ListProc').query,
		Session: require('./resolvers/Session').query,
	},
	Mutation: {
		FormProc: require('./resolvers/FormProc').mutation,
	},
};
const schemas = require('./schemas');

const getUser = async (event) => {
	try {
		const auth0User = await auth0.getUser(event);
		if (!auth0User) return {};
		console.log('TODO: userStore.read is broken');
		return {};
		// const [user = {}] = await userStore.read({ ctx: { user: auth0User } });
		// return { ...user, auth0User };
	} catch (e) {
		console.error(e);
		return {};
	}
};

const getGraphQLArgs = async (event) => {
	const { body } = event;
	let source, variables, operationName;
	let query = tryParse(body);
	if (!query) {
		try {
			const buffer = Buffer.from(body, 'base64');
			const stringedBuffer = buffer.toString('UTF-8');
			query = JSON.parse(stringedBuffer);
		} catch (e) {
			query = {};
			console.error('could not parse body', { body });
		}
	}
	const contextValue = {
		user: await getUser(event),
	};
	if (typeof query !== 'string') {
		({ query: source, variables, operationName } = query);
	}
	const { tag, ...variableValues } = variables || {};

	const loadedSchemas = loadSchemaSync(schemas, {});
	const typeDefs = mergeTypeDefs(loadedSchemas);
	const globalSchema = makeExecutableSchema({ typeDefs, resolvers });

	const gqlArgs = {
		schema: globalSchema,
		source,
		variableValues,
		operationName,
		contextValue,
	};
	return gqlArgs;
};

const getCorsHeaders = ({ event, allowed }) => {
	const { origin } = event?.headers || {};
	const AllowOrigin = allowed.find((x) => x.startsWith(origin)) ? origin : '';
	const headers = {
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Origin': AllowOrigin,
		'Access-Control-Allow-Methods': 'OPTIONS,POST',
	};
	return headers;
};

const handler = (config) => async (event) => {
	try {
		const headers = getCorsHeaders({ event, ...config?.cors });
		const graphQLArgs = await getGraphQLArgs(event);
		const mocks = getMocks(config);
		graphQLArgs.contextValue.mocks = mocks;

		const result = await graphql(graphQLArgs);
		result.errors = result.errors
			? result.errors.map((x) => x.message)
			: result.errors;
		const response = {
			headers,
			statusCode: 200,
			body: JSON.stringify(result),
		};
		DB.close();
		return response;
	} catch (e) {
		console.error(e);
		return {
			headers: {
				'Content-Type': 'application/json',
			},
			statusCode: 200,
			body: JSON.stringify({ errors: ['server error'] }),
		};
	}
};
module.exports = { handler };
