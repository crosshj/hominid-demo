/*

this file is mostly just a JS version of the following:
getMatches.ts
getTriggerConditions.ts
parseNotifications.ts

it may be better to turn notificationLogic.js into a TS and put these things back
I didn't have the time or the brain to putz around with TS in the moment, but I wanted to use what was already written
feel free to correct that!

*/

import _ from 'lodash';
import { parseProps } from '../../../framework/core/parseProps';
import { StateManager } from '../../../state/state';
import { clone } from '../../utils';

export const getTriggerConditions = (props = {}) => {
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

const doesMatch = (n, { key, expectedValue }) => {
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

export const getMatches = (notifications = [], allConditions = []) => {
	if (!Array.isArray(notifications) || !Array.isArray(allConditions))
		return [];
	return notifications.filter((n) =>
		allConditions.every((x) => doesMatch(n, x)),
	);
};

const toNotifications = (x = {}) => {
	return {
		...x,
		// NotificationBody:
		// 	x?.EventName +
		// 	' by ' +
		// 	x?.CausedByFirstName +
		// 	' ' +
		// 	x?.CausedByLastName,
	};
};

export const getEventTriggers = (UIContext) => {
	if (!Array.isArray(UIContext) || !UIContext.length) return [];
	return UIContext.map((x) => {
		if (x.type !== 'Trigger') return false;

		const _props = parseProps(x);

		const hasAnyEventProp = Object.keys(_props).some((key) =>
			key.startsWith('event:'),
		);

		if (!hasAnyEventProp) return false;

		return { props: _props };
	}).filter(Boolean);
};

/**
 * Checks whether notifications must trigger a flow or show on the NotificationsBadge.
 */
export const parseNotifications = (newNotifications = [], UIContext = []) => {
	let debug =
		false || localStorage?.getItem('DEBUG_NOTIFICATIONS') + '' === 'true';
	const eventTriggers = getEventTriggers(UIContext);

	// there are no triggers, i.e all events should be notifications
	if (_.isEmpty(eventTriggers)) {
		if (debug) {
			console.log('Events: parseNotifications', {
				newNotifications,
				UIContext,
			});
		}
		return {
			trigger: [],
			notify: newNotifications.map(toNotifications),
			markRead: [],
		};
	}

	const toTrigger = [];
	const notificationIdsToTrigger = [];
	const markRead = [];

	for (const { props } of eventTriggers) {
		const conditionsToTrigger = getTriggerConditions(props);

		const matches = getMatches(newNotifications, conditionsToTrigger);

		if (debug || props.debug) {
			debug = true;
			console.log('Events: parseNotifications', {
				newNotifications,
				conditionsToTrigger,
				matches,
			});
		}

		if (matches.length > 0) {
			notificationIdsToTrigger.push(
				...matches.map((x) => x.NotificationID),
			);

			toTrigger.push({
				handler: props.handler,
				notificationsToRead: matches,
			});
		}
	}

	const notificationsParsed = newNotifications
		.map((x) => {
			if (notificationIdsToTrigger.includes(x.NotificationID))
				return false;

			return toNotifications(x);
		})
		.filter(Boolean);

	for (const { handler, notificationsToRead } of toTrigger) {
		markRead.push(...notificationsToRead.map((x) => x.NotificationID));
	}

	if (debug) {
		console.log('Events: parseNotifications (with triggers)', {
			toTrigger,
			notificationIdsToTrigger,
			notificationsParsed,
			markRead,
		});
	}

	return {
		trigger: toTrigger,
		notify: notificationsParsed,
		markRead,
	};
};
