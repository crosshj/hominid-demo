const menu = [
	{
		href: '',
		label: 'Home',
		order: '2',
		properties: 'icon:Home',
	},
	{
		href: '#/addIssue',
		label: '+Issue',
		order: '3',
		properties: 'icon:Add',
	},
	{
		href: '#/issues',
		label: 'Issues',
		order: '4',
		properties: 'icon:ListAlt',
	},
	{
		href: '#/board',
		label: 'Board',
		order: '4.1',
		properties: 'icon:ViewKanban',
	},
	{
		href: '#/gantt',
		label: 'Gantt',
		order: '4.3',
		properties: 'icon:Analytics',
	},
	{
		href: '#/wiki',
		label: 'Wiki',
		order: '5',
		properties: 'icon:MenuBook',
	},
	{
		href: '#/files',
		label: 'Files',
		order: '6',
		properties: 'icon:DriveFolderUpload',
	},
	{
		href: '#/projectSettings',
		label: 'Settings',
		order: '10',
		properties: 'icon:Settings',
	},
	{
		href: '#/features',
		label: 'Features',
		order: '11',
		properties: 'icon:Settings',
	},
];
module.exports = () => {
	return JSON.stringify(menu);
};
