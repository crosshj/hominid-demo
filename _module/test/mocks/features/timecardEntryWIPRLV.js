const mock = [
	{
		TalentID: 1,
		JobOrderID: 1,
		ShiftID: 1,
		AssignmentID: 1,
		AssignmentName: 'Anthroware Assignment 1',
		TalentName: 'Harrison Cross',
		JobOrderName: 'Anthroware Job Order 1',
		ClientName: 'Anthroware',
		ShiftName: 'First Shift',
		TimeType: 1,
		StartTime: 'Monday, 09/25/2023 8:00 AM',
		EndTime: 'Monday, 09/25/2023 12:00 PM',
		Hrs: 4,
	},
	{
		TalentID: 1,
		JobOrderID: 1,
		ShiftID: 1,
		AssignmentID: 1,
		AssignmentName: 'Anthroware Assignment 1',
		TalentName: 'Harrison Cross',
		JobOrderName: 'Anthroware Job Order 1',
		ClientName: 'Anthroware',
		ShiftName: 'First Shift',
		TimeType: 2,
		StartTime: 'Monday, 09/25/2023 12:00 PM',
		EndTime: 'Monday, 09/25/2023 1:00 PM',
		Hrs: 1,
	},
	{
		TalentID: 1,
		JobOrderID: 1,
		ShiftID: 1,
		AssignmentID: 1,
		AssignmentName: 'Anthroware Assignment 1',
		TalentName: 'Harrison Cross',
		JobOrderName: 'Anthroware Job Order 1',
		ClientName: 'Anthroware',
		ShiftName: 'First Shift',
		TimeType: 3,
		StartTime: 'Monday, 09/25/2023 1:00 PM',
		EndTime: 'Monday, 09/25/2023 5:00 PM',
		Hrs: 4,
	},
].map((x, i) => ({ ...x, myIndex: i + '' }));

module.exports = (args, query, session) => {
	//if (args?.itemId) return;
	return JSON.stringify(mock);
};
