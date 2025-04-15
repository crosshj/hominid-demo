import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';
import { StateManager } from '../../../state/state';

const callsMap = {};

export const getContext = async (args = {}) => {
	const { setUIContext, key, param } = args;
	StateManager.update('loading', true);
	const subKey = `${key}-${param}`;
	if (subKey in callsMap) {
		console.log('Skipped query call for', { subKey });
		return;
	}

	try {
		callsMap[subKey] = true;

		const { ContextProc } = await graphQLClient.request(query, {
			tag: `ctx:${key}`,
			input: [
				{
					name: 'ui.sp_UIContextGetComponentsByUserID',
					uuid: uuidv4(),
					args: JSON.stringify({
						key: (key || '').startsWith('/')
							? key.replace(/^\//, '')
							: key,
						param,
					}),
				},
			],
		});
		await setUIContext(ContextProc[0]?.results);
	} catch (e) {
		//console.log(e);
	}
	delete callsMap[subKey];
	StateManager.update('loading', false);
};
