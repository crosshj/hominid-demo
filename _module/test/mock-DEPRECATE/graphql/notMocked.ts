const notFound = (req) => {
	const { query, body, params, headers } = req;
	console.log(query, body, params, headers);
	return `
> this is NOT mocked ->  **${req.url}**
`.trim();
};
export const notMocked = (req) =>
	JSON.stringify({
		data: {
			ContextProc: [
				{
					cacheExpires: null,
					name: 'ui.sp_UIContextGetComponentsByUserID',
					uuid: '96ac86c4-5cd3-45eb-ba5d-ebcce4edcb56',
					results: [
						{
							default: '',
							key: 'home',
							order: '1',
							type: 'Page',
						},
						{
							default: '',
							key: 'pageHeader',
							label: '',
							order: '101',
							parent: 'home',
							type: 'PageNavBar',
						},
						{
							default: '',
							key: 'pageContent',
							order: '102',
							parent: 'home',
							type: 'PageContent',
						},
						{
							default: '',
							key: 'text',
							order: '10201',
							parent: 'pageContent',
							type: 'Markdown',
							properties: `textContent:${notFound(req)}`,
						},
					],
				},
			],
		},
	});
