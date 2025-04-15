// eslint-disable-next-line import/no-anonymous-default-export
export const Input_Props_1 = {
	propsFilled: {
		value: '2019-05-24T19:30',
	},
	propsIntact: {
		_src: {
			type: 'datetime-local',
			inputProps: 'min:2019-01-24T00\\:00;max:2020-05-31T00\\:00',
			sx: 'minWidth:25ch',
		},
		useData: 'inputTestData1[0].datetime',
		label: 'Date Time',
		target: '',
		value: 'row_datetime',
		type: 'datetime-local',
		__rowIndex: 0,
		__rowStateKey: 'inputTestData1',
	},
};

export const Input_Props_2 = {
	propsFilled: {
		value: 1000,
	},
	propsIntact: {
		useData: 'fooState',
		type: 'TextField',
		default: '',
		label: ':foo',
		parent: 'featuresDataPathBased.PageContent.Card.1.Box.0',
		target: '',
		value: 'global_fooState',
		id: 'featuresDataPathBased.PageContent.Card.1.Box.0.TextField',
		_src: {
			id: 'featuresDataPathBased.PageContent.Card.1.Box.0.TextField',
			children: [],
			type: 'TextField',
			sx: 'width:100%',
			default: '',
			label: ':foo',
			order: '108060101',
			parent: 'featuresDataPathBased.PageContent.Card.1.Box.0',
			target: '',
			value: 'global_fooState',
		},
	},
};

export const Select_Props_1 = {
	propsFilled: {
		options: [
			{
				key: '',
				label: 'Yes',
				order: 0,
				value: 1,
				type: 'Option',
				parent: '',
				properties: '',
			},
			{
				key: '',
				label: 'No',
				order: 1,
				value: 2,
				type: 'Option',
				parent: '',
				properties: '',
			},
		],
		value: '2',
	},
	propsIntact: {
		_src: {
			select: 'select',
			options: 'global_dataYesNo',
			sx: 'minWidth:25ch',
			debug: 'debug',
		},
		label: '',
		target: '',
		value: 'row_isYesNo',
		select: 'select',
		options: 'global_dataYesNo',
		debug: 'debug',
		__rowIndex: 0,
		__rowStateKey: 'optionsExample1',
	},
};

export const Select_Props_2 = {
	propsFilled: {
		value: '1',
		options: [
			{
				label: 'Option 1',
				value: 1,
			},
			{
				label: 'Option 2',
				value: 2,
			},
			{
				label: 'Option 3',
				value: 3,
			},
			{
				label: 'Option 4',
				value: 4,
			},
			{
				label: 'Option 5',
				value: 5,
			},
		],
	},
	propsIntact: {
		options: 'global_optionsExample2',
		select: 'select',
		fullWidth: 'fullWidth',
		type: 'TextField',
		default: '',
		label: 'Assignments',
		parent: 'Page.PageContent.Box',
		target: '',
		value: 'global_selectedAssignment',
		id: 'Page.PageContent.Box.TextField.1',
		_src: {
			id: 'Page.PageContent.Box.TextField.1',
			children: [],
			type: 'TextField',
			options: 'global_optionsExample2',
			select: 'select',
			fullWidth: 'fullWidth',
			default: '',
			label: 'Assignments',
			order: '1070107',
			parent: 'Page.PageContent.Box',
			target: '',
			value: 'global_selectedAssignment',
		},
	},
};

export const IconButton_Props_1 = {
	useDataProp: 'tableCurrentRow',
	propsFilled: {},
	propsIntact: {
		_src: {
			icon: 'Delete',
			color: 'indigo800',
			useData: 'tableCurrentRow',
			useFlow: 'myActionDeleteFlow',
		},
		label: '',
		target: '',
		value: '',
		icon: 'Delete',
		color: 'indigo800',
		useFlow: 'myActionDeleteFlow',
		__rowIndex: 0,
		__rowStateKey: 'extensibleColsData',
	},
};

export const Chip_Props_1 = {
	propsFilled: {},
	propsIntact: {
		_src: {
			backgroundColor: 'indigo800',
			icon: 'Refresh',
		},
		label: 'Processing',
		target: '',
		value: '',
		backgroundColor: 'indigo800',
		icon: 'Refresh',
	},
};
