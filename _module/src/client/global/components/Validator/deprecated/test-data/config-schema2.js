export const configSchema2 = {
	userValidate: {
		Object: {
			name: 'user',
			String: [
				{
					name: 'name',
					min: 3,
					max: 30,
					required: 'required',
				},
				{
					name: 'email',
					email: 'email',
				},
				{
					name: 'website',
					url: 'url',
					nullable: 'nullable',
				},
			],
			Number: {
				name: 'age',
				required: 'required',
				positive: 'positive',
				integer: 'integer',
			},
			Date: {
				name: 'createdOn',
				defaultValue: 'now',
			},
			//TODO: this should cause validation to fail with current tests
			Object: {
				name: 'nested',
				required: 'required',
				String: [
					{
						name: 'name',
						min: 3,
						max: 30,
						required: 'required',
					},
				],
			},
		},
	},
};
