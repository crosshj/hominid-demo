import _ from 'lodash';
import { getMatches } from './getMatches';
import { getTriggerConditions } from './getTriggerConditions';

import type { Notification } from './types';
import { parseProps } from '../../../framework/core/parseProps';

const toNotifications = (x: Notification): Notification => {
	return {
		...x,
		NotificationBody:
			x.EventName +
			' by ' +
			x.CausedByFirstName +
			' ' +
			x.CausedByLastName,
	};
};

const getEventTriggers = (UIContext: any) => {
	return UIContext.map((x: any) => {
		if (x.type !== 'Trigger') return false;

		const _props = parseProps(x);

		const hasAnyEventProp = Object.keys(_props).some((key) =>
			key.startsWith('event:'),
		);

		if (!hasAnyEventProp) return false;

		return { props: _props };
	}).filter(Boolean) as { props: Record<string, any> }[];
};

/**
 * Checks whether notifications must trigger a flow or show on the NotificationsBadge.
 */
export const parseNotifications = (
	newNotifications: Notification[],
	UIContext: any,
) => {
	const eventTriggers = getEventTriggers(UIContext);

	// there are no triggers, i.e all events should be notifications
	if (_.isEmpty(eventTriggers)) {
		return { toTrigger: [], notificationsParsed: newNotifications };
	}

	const toTrigger: {
		handler: string;
		notificationsToRead: Notification[];
	}[] = [];
	const notificationIdsToTrigger: number[] = [];

	let debug = false;

	for (const { props } of eventTriggers) {
		const conditionsToTrigger = getTriggerConditions(props);

		const matches = getMatches(newNotifications, conditionsToTrigger);

		if (debug || props.debug) {
			debug = true;
			console.log('Trigger:event:debug', {
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
		.filter(Boolean) as Notification[];

	if (debug) {
		console.log('Trigger:event:debug results', {
			toTrigger,
			notificationIdsToTrigger,
			notificationsParsed,
		});
	}

	return { toTrigger, notificationsParsed };
};
