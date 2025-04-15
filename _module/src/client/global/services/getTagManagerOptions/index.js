import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';

export const getTagManagerOptions = async ({ targetQuery, setTags }) => {
	try {
		if (!setTags) return;
		const { ContextProc } = await graphQLClient.request(query, {
			tag: `tag:${targetQuery}`,
			input: [
				{
					name: 'ui.sp_GetOptionLists',
					uuid: uuidv4(),
					args: JSON.stringify({
						key: targetQuery,
					}),
				},
			],
		});
		const optionsList = ContextProc[0]?.results;
		setTags(optionsList);
	} catch (err) {
		console.error('getOptions error', err);
	}
};
