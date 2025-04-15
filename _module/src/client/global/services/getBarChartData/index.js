import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';

export const getBarChartData = async (target) => {
	const res = await graphQLClient.request(query, {
		input: [
			{
				name: 'ui.sp_GetStackedBarCharts',
				uuid: uuidv4(),
				args: JSON.stringify({
					key: target,
				}),
			},
		],
	});

	return res;
};
