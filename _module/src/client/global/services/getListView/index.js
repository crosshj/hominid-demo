import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';

export const getListView = async (key, param) => {
	const args = {
		key,
	};
	if (param && !['undefined', 'null'].includes(param)) {
		args.param = param;
	}
	const response = await graphQLClient.request(query, {
		tag: `list:${key}`,
		input: [
			{
				name: 'ui.sp_GetResourceListViews',
				uuid: uuidv4(),
				args: JSON.stringify(args),
			},
		],
	});

	return response;
};
