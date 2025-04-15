import { StateManager } from '../../../state/state';
import type { TriggerCondition } from './types';

export const getTriggerConditions = (
	props: Record<string, any>,
): TriggerCondition[] => {
	return Object.entries(props)
		.filter(([key]) => key.startsWith('event:'))
		.map(([key, value]) => {
			return {
				key: key.replace('event:', ''),
				expectedValue: value.startsWith('global_')
					? StateManager.get(value.replace('global_', ''))
					: value,
			};
		});
};
