import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';

export const getFormSelectOptions = async (targetQuery) => {
	try {
		const response = await graphQLClient.request(query, {
			tag: `options:${targetQuery}`,
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
		return response;
	} catch (err) {
		console.error('getOptions error', err);
	}
};
