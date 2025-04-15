import { v4 as uuidv4 } from 'uuid';
import query from './query.gql';
import { StateManager } from '../../../state/state';
import { graphQLClient } from '../../../framework/api';
import { enhanceResults } from '../../utils/parseProperties';

export const getData = async (source, params, setState, name) => {
	StateManager.update('loading', true);
	const { Data } = await graphQLClient.request(query, {
		tag: `data:${params?.key || name}`,
		input: [
			{
				name: source,
				uuid: uuidv4(),
				args: JSON.stringify({
					...params,
					...(source === 'listView' ? { key: name } : {}),
				}),
			},
		],
	});
	const { results } = Array.isArray(Data) ? Data[0] : { results: '{}' };

	const parsedResults = enhanceResults(JSON.parse(results));

	//setState && setState({ [name]: parsedResults, loading: false });
	StateManager.update(name, parsedResults);
	StateManager.update('loading', false);
	return parsedResults;
};
