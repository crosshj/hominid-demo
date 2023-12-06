const menu = [
	{
		key: '/',
		label: 'Home',
		order: '2',
		properties: 'icon:Home',
	},
	{
		key: '/#/addIssue',
		label: '+Issue',
		order: '3',
		properties: 'icon:Add',
	},
	{
		key: '/#/issues',
		label: 'Issues',
		order: '4',
		properties: 'icon:ListAlt',
	},
	{
		key: '/#/board',
		label: 'Board',
		order: '4.1',
		properties: 'icon:ViewKanban',
	},
	{
		key: '/#/gantt',
		label: 'Gantt',
		order: '4.3',
		properties: 'icon:Analytics',
	},
	{
		key: '/#/wiki',
		label: 'Wiki',
		order: '5',
		properties: 'icon:MenuBook',
	},
	{
		key: '/#/files',
		label: 'Files',
		order: '6',
		properties: 'icon:DriveFolderUpload',
	},
	{
		key: '/#/projectSettings',
		label: 'Settings',
		order: '10',
		properties: 'icon:Settings',
	},
	{
		key: '/#/features',
		label: 'Features',
		order: '11',
		properties: 'icon:Settings',
	},
];
module.exports = () => {
	return JSON.stringify(menu);
};
