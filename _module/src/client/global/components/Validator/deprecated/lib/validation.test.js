import {
	CONFIG_DATA_SHAPE_OBJ_COLLECTION,
	CONFIG_DATA_SHAPE_SINGLE_ENTITY_STRING,
	CONFIG_DATA_SHAPE_SINGLE_ENTITY_NUMBER,
	CONFIG_DATA_SHAPE_SINGLE_ENTITY_DATE,
	STANDARD_DATA_SHAPE,
	STANDARD_DATA_SHAPE_SINGLE_ENTITY_STRING,
	STANDARD_DATA_SHAPE_SINGLE_ENTITY_NUMBER,
	STANDARD_DATA_SHAPE_SINGLE_ENTITY_DATE,
	YUP_SINGLE_STRING_SCHEMA,
	YUP_COLLECTION_SCHEMA,
} from './mockConfig';
import {
	composeYupSchema,
	mapFromConfig,
	mapToSchema,
	validate,
} from './index.js';
import { configSchema2 } from '../test-data/config-schema2.js';
import { config2GoodData1 } from '../test-data/config-schema2-good-data1';
import { config2BadData1 } from '../test-data/config-schema2-bad-data1';
import { schema as jsonSchema1 } from '../test-data/jsonSchema1';
import { buildYup } from 'schema-to-yup';

const _dataMap = {
	config: {
		single: {
			string: CONFIG_DATA_SHAPE_SINGLE_ENTITY_STRING,
			number: CONFIG_DATA_SHAPE_SINGLE_ENTITY_NUMBER,
			date: CONFIG_DATA_SHAPE_SINGLE_ENTITY_DATE,
		},
		collection: {
			default: CONFIG_DATA_SHAPE_OBJ_COLLECTION,
		},
	},
	standard: {
		single: {
			string: STANDARD_DATA_SHAPE_SINGLE_ENTITY_STRING,
			number: STANDARD_DATA_SHAPE_SINGLE_ENTITY_NUMBER,
			date: STANDARD_DATA_SHAPE_SINGLE_ENTITY_DATE,
		},
		collection: {
			default: STANDARD_DATA_SHAPE,
		},
	},
	yup: {
		single: {
			string: YUP_SINGLE_STRING_SCHEMA,
		},
		collection: {
			default: YUP_COLLECTION_SCHEMA,
		},
	},
};

const SHAPES = Object.freeze(_dataMap);

xdescribe('validation', () => {
	describe('assert standard shapes', () => {
		describe('when dealing with collection', () => {
			it('should return an object of standard pattern if given a collection of primitives', () => {
				expect(
					mapFromConfig(CONFIG_DATA_SHAPE_OBJ_COLLECTION),
				).toMatchObject(STANDARD_DATA_SHAPE);
			});
		});
		describe('when dealing with a single entity representing a primitive', () => {
			it('should return an object of standard pattern if given a single String primitive', () => {
				expect(
					mapFromConfig(SHAPES.config.single.string),
				).toMatchObject(SHAPES.standard.single.string);
			});
			it('should return an object of standard pattern if given a single Number primitive', () => {
				expect(
					mapFromConfig(SHAPES.config.single.number),
				).toMatchObject(SHAPES.standard.single.number);
			});
			it('should return an object of standard pattern if given a single Date primitive', () => {
				expect(mapFromConfig(SHAPES.config.single.date)).toMatchObject(
					SHAPES.standard.single.date,
				);
			});
		});
	});
	describe('assert yup', () => {
		describe('assert yup shape conversion from standard', () => {
			it('should return a Yup schema when given a standard single string shape', () => {
				expect(
					mapToSchema(SHAPES.standard.single.string),
				).toMatchObject(SHAPES.yup.single.string);
			});
			it('should return a Yup schema when given a standard collection shape', () => {
				expect(
					mapToSchema(SHAPES.standard.collection.default),
				).toMatchObject(SHAPES.yup.collection.default);
			});
		});
		describe('test validation', () => {
			// String
			it('should validate schema of single string', async () => {
				const schema = mapToSchema(SHAPES.standard.single.string);
				await expect(
					validate(schema, { username: 'Potato' }),
				).resolves.toBeTruthy();
			});
			it('should fail if schema of single string is empty', async () => {
				const schema = mapToSchema(SHAPES.standard.single.string);
				await expect(validate(schema, {})).rejects.toBeTruthy();
			});
			// Number
			it.todo('should success if schema of single number is valid');
			it.todo('should fail if schema of a single number is invalid');
			// Date
			it.todo('should success if schema of single date is valid');
			it.todo('should fail if schema of a single date is invalid');
			// Collections
			it.todo(
				'should succeed if given a schema of a collection of several equal primitives',
			);
		});
	});
});

describe('validation, redo', () => {
	it('should map from config, configSchema2', () => {
		const mapped = mapFromConfig(configSchema2);
		expect(mapped.fields.length).toBe(1);
		expect(mapped.fields[0].validations.length).toBe(6);
	});
	it('should use mapped config to validate GOOD data, configSchema2', async () => {
		const config = mapFromConfig(configSchema2);
		//console.log(JSON.stringify(config, null, 2));
		const schema = mapToSchema(config);
		//console.log({ config2GoodData1 });
		const { errors, results } = await validate(schema, config2GoodData1);
		expect(errors).not.toBe({});
		expect(results).toEqual({
			age: 33,
			createdOn: new Date('2021-12-21T05:00:00.000Z'),
			email: 'user@email.com',
			name: 'Short Name',
			website: 'https://www.shorty.com',
		});
	});
	it('should use mapped config to validate BAD data, configSchema2', async () => {
		const config = mapFromConfig(configSchema2.userValidate);
		const schema = mapToSchema(config);
		const { errors, results } = await validate(schema, config2BadData1);
		expect(results).not.toBeDefined();
		expect(errors).toEqual({
			age: [
				'age must be a `number` type, but the final value was: `NaN` (cast from the value `"bad not an age"`).',
			],
			createdOn: [
				'createdOn must be a `date` type, but the final value was: `Invalid Date` (cast from the value `"bad not a date"`).',
			],
			email: ['email must be a valid email'],
			name: ['name must be at most 30 characters'],
			website: ['website must be a valid URL'],
		});
	});
});

describe('validation, without config translation', () => {
	it('should use mapped config to validate BAD data, configSchema2', async () => {
		const { errors } = await validate(jsonSchema1, config2BadData1);
		expect(errors).toEqual({
			name: ['Name too long'],
			age: ['Bad age type'],
			email: ['Bad email'],
			website: ['Bad website'],
		});
	});
	it('test schema-to-yup directly', () => {
		let valid;
		const message = {
			title: 'users',
			type: 'object',
			required: ['username', 'age'],
			properties: {
				username: {
					type: 'string',
					matches: 'foo',
					errMessages: {
						required: 'User is required',
						matches: 'User must be foo',
					},
				},
				age: {
					type: 'integer',
					errMessages: {
						typeError: 'Bad age type',
					},
				},
			},
		};
		const config = {};
		try {
			const yupSchema = buildYup(message, config);
			valid = yupSchema.validateSync(
				{
					foo: 'dfds',
					age: 'erer',
				},
				{ abortEarly: false },
			);
		} catch (e) {
			valid = e.errors;
		}
		expect(valid).toEqual(['User is required', 'Bad age type']);
	});
});
