export const idTree1 = {
	id: 'Page',
	type: 'Page',
	children: [
		{
			id: 'Page.Validator',
			type: 'Validator',
			children: [
				{
					type: 'Object',
					id: 'Page.Validator.Object',
					children: [
						{
							type: 'String',
							id: 'Page.Validator.Object.String.0',
							props: {
								name: 'username',
								alphanum: true,
								min: 3,
								max: 30,
								required: true,
							},
						},
						{
							type: 'String',
							id: 'Page.Validator.Object.String.1',
							props: {
								name: 'address',
								required: true,
							},
						},
						{
							type: 'Number',
							id: 'Page.Validator.Object.Number',
							props: {
								name: 'age',
								required: true,
							},
						},
					],
				},
			],
		},
	],
};
export const schema1 = {
	Object: {
		String: [
			{
				name: 'username',
				alphanum: true,
				min: 3,
				max: 30,
				required: true,
			},
			{
				name: 'address',
				required: true,
			},
		],
		Number: {
			name: 'age',
			required: true,
		},
	},
};
export const schema2 = {
	Array: {
		String: [
			{
				name: 'username',
				alphanum: true,
				min: 3,
				max: 30,
				required: true,
			},
			{
				name: 'address',
				required: true,
			},
		],
		Number: {
			name: 'age',
			required: true,
		},
	},
};

export const schema3 = {
	Number: {
		name: 'age',
		required: true,
	},
};

export const schema4 = {
	String: {
		name: 'username',
		alphanum: true,
		min: 3,
		max: 30,
		required: true,
	},
};

export const schema5 = {
	Boolean: {
		required: false,
	},
};

/*
export const schemaGeneral = {
	[YUPPrimitiveName]: {
		// ... yup primitive rules
	}
}
*/
