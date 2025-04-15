import { Notification } from '../../../framework/types';

export const toNotifications = (x: Notification): Notification => {
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
