const menu = [
	{
		key: '/#/blank',
		label: 'Home',
		order: '2',
		properties: 'icon:Home',
	},
	{
		key: '/#/blank',
		label: '+Issue',
		order: '3',
		properties: 'icon:Add',
	},
	{
		key: '/#/blank',
		label: 'Issues',
		order: '4',
		properties: 'icon:ListAlt',
	},
	{
		key: '/#/blank',
		label: 'Board',
		order: '4.1',
		properties: 'icon:ViewKanban',
	},
	{
		key: '/#/blank',
		label: 'Gantt',
		order: '4.3',
		properties: 'icon:Analytics',
	},
	{
		key: '/#/blank',
		label: 'Wiki',
		order: '5',
		properties: 'icon:MenuBook',
	},
	{
		key: '/#/blank',
		label: 'Files',
		order: '6',
		properties: 'icon:DriveFolderUpload',
	},
	{
		key: '/#/blank',
		label: 'Settings',
		order: '10',
		properties: 'icon:Settings',
	},
	{
		key: '/#/blank',
		label: 'Features',
		order: '11',
		properties: 'icon:Settings',
	},
];
module.exports = () => {
	return JSON.stringify(menu);
};
