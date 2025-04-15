import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from '../getContext/query.gql';

export const getNewFormDefinition = async ({ key, param }) => {
	const response = await graphQLClient.request(query, {
		tag: `formDef:${key}`,
		input: [
			{
				name: 'ui.sp_UIContextGetComponentsByUserID',
				uuid: uuidv4(),
				args: JSON.stringify({
					key,
					param,
				}),
			},
		],
	});

	return response;
};
