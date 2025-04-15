// Coming from back config
export const mockConfig = {
	default: '',
	id: 'Page.Validator.Object.String.0',
	key: 'Page.Validator.Object.String.0',
	label: '',
	order: '1010101',
	parent: 'Page.Validator.Object',
	props: { name: 'username', min: 3, max: 30, required: true },
	target: '',
	type: 'String',
	value: '',
};

// mapped mockConfig, expected on yupSchemaGenerator function
export const mockMapFromConfig = {
	label: 'Username',
	name: 'username',
	validationType: 'string',
	validations: [{ type: 'required', params: true }],
};

// yup expected schema
export const mockExpectedSchema = {
	fields: {
		username: {},
	},
};
