// Supply the scenarios from this file.
// utils/testData/idTree.js

// This is a mock result retrieved from ObjectFromIdTree
// Emulates a collections of types inside an Object
export const CONFIG_DATA_SHAPE_OBJ_COLLECTION = {
	isMyObject: {
		String: [
			{
				name: 'username',
				min: 3,
				max: 30,
				required: true,
			},
			{
				name: 'password',
				min: 8,
				required: true,
			},
		],
		Number: {
			name: 'age',
			required: true,
			min: 18,
			nullable: true,
		},
		Boolean: {
			name: 'newsletter',
			required: true,
		},
	},
};

export const STANDARD_DATA_SHAPE = {
	key: 'isMyObject',
	fields: [
		{
			name: 'username',
			label: 'Username',
			validationType: 'string',
			validations: [
				{ type: 'min', params: [3] },
				{ type: 'max', params: [30] },
				{ type: 'required', params: ['Required'] },
			],
		},
		{
			name: 'password',
			label: 'Password',
			validationType: 'string',
			validations: [
				{ type: 'min', params: [8] },
				{ type: 'required', params: ['Required'] },
			],
		},
		{
			name: 'age',
			label: 'Age',
			validationType: 'number',
			validations: [
				{ type: 'required', params: ['Required'] },
				{ type: 'min', params: [18] },
				{ type: 'nullable', params: ['Nullable'] },
			],
		},
		{
			name: 'newsletter',
			label: 'Newsletter',
			validationType: 'boolean',
			validations: [{ type: 'required', params: ['Required'] }],
		},
	],
};

// Single String
export const CONFIG_DATA_SHAPE_SINGLE_ENTITY_STRING = {
	String: {
		name: 'username',
		min: 3,
		max: 30,
		required: true,
	},
};
export const STANDARD_DATA_SHAPE_SINGLE_ENTITY_STRING = {
	key: 'String',
	fields: [
		{
			name: 'username',
			label: 'Username',
			validationType: 'string',
			validations: [
				{ type: 'min', params: [3] },
				{ type: 'max', params: [30] },
				{ type: 'required', params: ['Required'] },
			],
		},
	],
};
// Single Number
export const CONFIG_DATA_SHAPE_SINGLE_ENTITY_NUMBER = {
	Number: {
		name: 'age',
		required: true,
	},
};
export const STANDARD_DATA_SHAPE_SINGLE_ENTITY_NUMBER = {
	key: 'Number',
	fields: [
		{
			name: 'age',
			label: 'Age',
			validationType: 'number',
			validations: [{ type: 'required', params: ['Required'] }],
		},
	],
};
// Single Date
export const CONFIG_DATA_SHAPE_SINGLE_ENTITY_DATE = {
	Date: {
		name: 'birthdate',
		required: true,
	},
};
export const STANDARD_DATA_SHAPE_SINGLE_ENTITY_DATE = {
	key: 'Date',
	fields: [
		{
			name: 'birthdate',
			label: 'Birthdate',
			validationType: 'date',
			validations: [{ type: 'required', params: ['Required'] }],
		},
	],
};

export const YUP_SINGLE_STRING_SCHEMA = {
	type: 'object',
	fields: {
		username: {
			type: 'string',
		},
	},
	_nodes: ['username'],
};

export const YUP_COLLECTION_SCHEMA = {
	type: 'object',
	fields: {
		newsletter: {
			type: 'boolean',
		},
		age: {
			type: 'number',
		},
		password: {
			type: 'string',
		},
		username: {
			type: 'string',
		},
	},
	_nodes: ['username', 'password', 'age', 'newsletter'],
};
