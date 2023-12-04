const menu = [
	{
		key: '/#/home',
		label: 'Home',
		order: '2',
		properties: 'icon:Home',
	},
	{
		key: '/#/browse',
		label: 'Browse',
		order: '3',
		properties: 'icon:Add',
	},
	{
		key: '/#/post',
		label: 'Post',
		order: '4',
		properties: 'icon:ListAlt',
	},
	{
		key: '/#/profile',
		label: 'Profile',
		order: '5',
		properties: 'icon:ListAlt',
	},
	{
		key: '/#/messages',
		label: 'Messages',
		order: '6',
		properties: 'icon:ListAlt',
	},
];
module.exports = () => {
	return JSON.stringify(menu);
};
