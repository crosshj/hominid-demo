export const schema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	$id: 'http://example.com/person.schema.json',
	title: 'User',
	description: 'A user',
	type: 'object',
	properties: {
		name: {
			type: 'string',
			min: 3,
			max: 30,
			errMessages: {
				required: 'Name required',
				min: 'Name too short',
				max: 'Name too long',
			},
		},
		age: {
			type: 'integer',
			errMessages: {
				typeError: 'Bad age type',
			},
		},
		email: {
			type: 'string',
			format: 'email',
			errMessages: {
				format: 'Bad email',
			},
		},
		website: {
			type: 'string',
			format: 'url',
			nullable: true,
			errMessages: {
				format: 'Bad website',
			},
		},
		eventDate: {
			type: 'date',
			min: '1-1-1900',
			maxDate: '1-1-2030',
			errMessages: {
				typeError: 'Bad date type',
			},
		},
	},
};
