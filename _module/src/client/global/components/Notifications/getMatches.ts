import _ from 'lodash';

import type { Notification, TriggerCondition } from './types';
import { StateManager } from '../../../state/state';
import { clone } from '../../utils';

const doesMatch = (
	n: Notification,
	{ key, expectedValue }: TriggerCondition,
) => {
	let _expectedValue = clone(expectedValue);

	if (typeof _expectedValue === 'undefined') return false;
	if (_.isString(_expectedValue) && _expectedValue.startsWith('global_')) {
		_expectedValue = StateManager.get(
			_expectedValue.replace('global_', ''),
		);
	}

	const notificationPropertyValue = _.get(n, key);

	return notificationPropertyValue === _expectedValue;
};

export const getMatches = (
	notifications: Notification[],
	allConditions: TriggerCondition[],
) => {
	return notifications.filter((n) =>
		allConditions.every((x) => doesMatch(n, x)),
	);
};
