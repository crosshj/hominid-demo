import _ from 'lodash';
import * as schemaToYup from 'schema-to-yup';

/*
		NOTES:
		1 - Breaking into smaller aux function will make easier to optmize
		2 - As soon as the logic is working on a high level, optimize the overall data structures and reduce the algo complexity
		3 - Identify and define main pattern for future extensibility
*/

// TODO: Move to utilities
export function capitalize(word) {
	if (word.length === 0) return false;
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function _convertField(field) {
	const { name, type, ...rest } = field;
	const validations = rest;
	const fieldValidations = [];

	// move to external auxiliary function
	if (!!Object.keys(validations).length) {
		Object.entries(validations).forEach((validation) => {
			let [type, value] = validation;
			if (value === true) value = capitalize(type);
			if (Array.isArray(value)) {
				for (const arrayValue of value) {
					fieldValidations.push({ type: type, params: [arrayValue] });
				}
				return;
			}
			fieldValidations.push({ type: type, params: [value] });
		});
	}
	return {
		name: name,
		label: capitalize(name || type),
		validationType: type.toLowerCase(),
		validations: fieldValidations,
	};
}

export function extractKeyValues(obj) {
	const key = Object.keys(obj)[0];
	const values = Object.values(obj);
	return { key, values };
}

export function mapFromConfig(dataFromConfig = {}) {
	const configObj = JSON.parse(JSON.stringify(dataFromConfig));
	const { key, values } = extractKeyValues(configObj);

	const convertedObj = {
		key,
		fields: [],
	};

	const handleMapping = (obj) => {
		const { values } = obj;
		// Note: not the best approach, review as soon as possible.
		const diffType = typeof Object.values(values[0])[0];
		if (diffType !== 'object') {
			const singleObj = { values: configObj[key], key };
			const handleSingle = _convertField({
				...singleObj.values,
				type: key,
			});
			convertedObj.fields.push(handleSingle);
			return;
		}

		Object.entries(configObj[key]).forEach(([type, values]) => {
			if (Array.isArray(values)) {
				values.forEach((field) => {
					const convertedField = _convertField({
						...field,
						type,
					});
					convertedObj.fields.push(convertedField);
				});
				return;
			}
			const convertedField = _convertField({
				...values,
				type,
			});
			convertedObj.fields.push(convertedField);
		});
	};

	handleMapping({ key, values });
	return convertedObj;
}

export function mapToSchema(mappedConfig) {
	const { fields } = mappedConfig;
	//console.log(JSON.stringify(fields[0].validations, null, 2));

	const jsonSchema = {
		type: fields[0].validationType,
		properties: fields[0].validations.reduce((a, o) => {
			const { name, ...rest } = o.params[0];
			for (const [key, value] of Object.entries(rest)) {
				if (key !== value) continue;
				rest[key] = true;
			}
			return {
				...a,
				[name]: {
					type: o.type.toLowerCase(),
					...rest,
				},
			};
		}, {}),
	};

	//console.log(jsonSchema);
	const schemaConfig = {};
	const schemaFromYup = schemaToYup.buildYup(jsonSchema, schemaConfig);
	return schemaFromYup;

	// const schema = fields.reduce((schema, field) => {
	// 	const {
	// 		name,
	// 		validationType,
	// 		validationTypeError,
	// 		validations = [],
	// 	} = field;
	// 	const isObject = (name || '').indexOf('.') >= 0;

	// 	if (!yup[validationType]) {
	// 		return schema;
	// 	}
	// 	let validator = yup[validationType]().typeError(
	// 		validationTypeError || ''
	// 	);
	// 	validations.forEach((validation) => {
	// 		const { params, type } = validation;
	// 		const yupValidator = yup[type.toLowerCase()];
	// 		if (!yupValidator) {
	// 			console.log(`No validator of type: ${type}`);
	// 			return;
	// 		}
	// 		validator = yupValidator(...params);
	// 	});

	// 	if (!isObject) {
	// 		return schema.concat(yup.object().shape({ [name]: validator }));
	// 	}

	// 	const reversePath = name.split('.').reverse();
	// 	const currNestedObject = reversePath.slice(1).reduce(
	// 		(yupObj, path, index, source) => {
	// 			if (!isNaN(path)) {
	// 				return {
	// 					array: yup.array().of(yup.object().shape(yupObj)),
	// 				};
	// 			}
	// 			if (yupObj.array) {
	// 				return { [path]: yupObj.array };
	// 			}
	// 			return { [path]: yup.object().shape(yupObj) };
	// 		},
	// 		{ [reversePath[0]]: validator }
	// 	);

	// 	const newSchema = yup.object().shape(currNestedObject);
	// 	return schema.concat(newSchema);
	// }, yup.object().shape({}));

	// return schema;
}

export function composeSchema(mapper, schemaMapper, data) {
	const mappedFromConfig = mapper(data);
	return schemaMapper(mappedFromConfig);
}

export function composeYupSchema(data) {
	if (data.properties) {
		const schemaFromYup = schemaToYup.buildYup(data);
		return schemaFromYup;
	}
	return composeSchema(mapFromConfig, mapToSchema, data);
}

export function validateUniqueField(jsonSchema, data, { uniqueField }) {
	const config = {};
	let errorsObj = {};
	let valid;

	const _schemaWithUniqueField = {
		$id: jsonSchema.$id,
		$schema: jsonSchema.$schema,
		description: jsonSchema.description,
		title: jsonSchema.title,
		type: jsonSchema.type,
		properties: {
			[uniqueField]: jsonSchema.properties[uniqueField],
		},
	};

	try {
		const yupSchema = schemaToYup.buildYup(_schemaWithUniqueField, config);

		valid = yupSchema.validateSync(data, { abortEarly: false });
	} catch (e) {
		for (const innerErrors of e.inner) {
			_.set(errorsObj, innerErrors.path, innerErrors.errors);
		}
	}
	return { valid, errors: errorsObj };
}

export function validateJsonSchema(jsonSchema, data, opts = {}) {
	const config = {};
	let errorsObj = {};
	let valid;

	try {
		const yupSchema = schemaToYup.buildYup(jsonSchema, config);
		valid = yupSchema.validateSync(data, { abortEarly: false });
	} catch (e) {
		for (const innerErrors of e?.inner) {
			_.set(errorsObj, innerErrors.path, innerErrors.errors);
		}
	}
	return { valid, errors: errorsObj };
}

export async function validate(validator, data) {
	if (validator.properties) {
		return validateJsonSchema(validator, data);
	}
	let errors,
		results,
		errorsObj = {};
	await validator
		.validate(data, { abortEarly: false })
		.then((x) => (results = x))
		.catch((e) => {
			for (const innerErrors of e.inner) {
				_.set(errorsObj, innerErrors.path, innerErrors.errors);
			}
			errors = e.errors;
		});
	return { results, errors: errorsObj };
	//return await validator?.validate(data, { abortEarly: false });
}
