const menu = [
	{
		key: '/#/framework/home',
		label: 'Home',
		order: '2',
		properties: 'icon:Home',
	},
	{
		key: '/#/framework/addIssue',
		label: 'Add Issue',
		order: '3',
		properties: 'icon:Add',
	},
	{
		key: '/#/framework/issues',
		label: 'Issues',
		order: '4',
		properties: 'icon:ListAlt',
	},
	{
		key: '/#/framework/board',
		label: 'Board',
		order: '4.1',
		properties: 'icon:ViewKanban',
	},
	{
		key: '/#/framework/gantt',
		label: 'Gantt Chart',
		order: '4.3',
		properties: 'icon:Analytics',
	},
	{
		key: '/#/framework/wiki',
		label: 'Wiki',
		order: '5',
		properties: 'icon:MenuBook',
	},
	{
		key: '/#/framework/files',
		label: 'Files',
		order: '6',
		properties: 'icon:DriveFolderUpload',
	},
	{
		key: '/#/framework/projectSettings',
		label: 'Project Settings',
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
