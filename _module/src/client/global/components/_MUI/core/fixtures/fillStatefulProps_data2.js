export const fillStatefulPropsData2 = {
	propsIntact: {
		_src: {
			textContent: '{{row_orderName}}',
			href: '/jobOrdersChildDetails/{{row_JobOrderID}}',
		},
		label: '',
		target: '',
		value: '',
		textContent: '{{row_orderName}}',
		href: '/jobOrdersChildDetails/{{row_JobOrderID}}',
		__rowIndex: 0,
		__rowStateKey: 'childHomeOrders',
	},
	statefulProps: {
		textContent: {
			tokens: [
				{
					key: 'textContent',
					match: '{{row_orderName}}',
					source: 'row',
					path: 'orderName',
				},
			],
			pathsToListen: ['childHomeOrders[0].orderName'],
			originalValue: '{{row_orderName}}',
		},
		href: {
			tokens: [
				{
					key: 'href',
					match: '{{row_JobOrderID}}',
					source: 'row',
					path: 'JobOrderID',
				},
			],
			pathsToListen: ['childHomeOrders[0].JobOrderID'],
			originalValue: '/jobOrdersChildDetails/{{row_JobOrderID}}',
		},
	},
};
