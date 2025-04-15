import { v4 as uuidv4 } from 'uuid';
import * as Api from '../../framework/api';

export const graphQLClient = Api.graphQLClient;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const GraphQL = async (args) => {
	const { setState, query, variables = {}, queryName, retry } = args;
	try {
		const queryDef = query;
		setState({ loading: true });
		for (const input of variables?.input || []) {
			input.uuid = input.uuid || uuidv4();
		}
		const tag = `${queryName}`;
		const results = await graphQLClient.request(queryDef, {
			tag,
			...variables,
		});
		if (!results && retry > 0) {
			await delay(500);
			return await GraphQL({ ...args, retry: args.retry - 1 });
		}
		setState({ loading: false, [queryName]: { ...results } });
		return results;
	} catch (error) {
		setState({ loading: false, error });
		throw new Error(error);
	}
};

export const useApi = ({ queryList, setState }) => {
	const Query = (queryName, query) => (variables) =>
		GraphQL({
			setState,
			query,
			variables,
			queryName,
		});

	const api = Object.entries(queryList).reduce((a, item) => {
		const [key, value] = item;

		return {
			...a,
			[key]: Query(key, value),
		};
	}, {});

	return api;
};
