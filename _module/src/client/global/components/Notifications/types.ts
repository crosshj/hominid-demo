export interface TriggerCondition {
	key: string;
	expectedValue: any;
}

export interface Notification {
	Comments: string;
	CreatedDT: string;
	EventCausedByUserID: string;
	CausedByFirstName: string;
	CausedByLastName: string;
	EventDT: string;
	EventLogID: number;
	EventName: string;
	NotificationBody: string;
	NotificationID: number;
	NotificationTargetUserID: string;
	NotificationType: string;
	ReadDT: string | null;
	SentDT: string | null;
	SentSuccessful: false;
	SubjectID: string;
	TriggerConditions: string;
	TriggerDescription: string;
	routeID: number;
	routeName: string;
	routeTargetID: string;
	routeToken: string;
	sendToExt: string;
}

export type NotificationsListener = [
	{
		notifications: Notification[];
		amountOfCalls: number;
	},
];
