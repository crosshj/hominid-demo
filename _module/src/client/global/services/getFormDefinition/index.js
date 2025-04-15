import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';

export const getFormDefinition = async (formKey, formParam = null) => {
	const response = await graphQLClient.request(query, {
		tag: `form:${formKey}`,
		input: [
			{
				name: 'ui.sp_formElementsGetbyFormKey',
				uuid: uuidv4(),
				args: JSON.stringify({
					key: formKey,
					...formParam,
				}),
			},
		],
	});

	return response;
};
