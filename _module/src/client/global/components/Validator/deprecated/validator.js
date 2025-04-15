// https://github.com/jquense/yup

import { clone } from '../../../utils';

const mockDataFromConfig = {};
transformFromConfig(mockDataFromConfig);

// TODO: Will normalize the data coming from config
function transformFromConfig(dataFromConfig = {}) {
	const fields = clone(dataFromConfig);

	return fields?.map(({ props }) => {
		const { name, type, ...rest } = props;
		const rules = rest;

		const parsedRules = Object.entries(rules).map((rule) => {
			const ruleObj = {
				type: rule[0],
				params: [rule[1]],
			};
			return ruleObj;
		});

		const config = {
			name: name,
			label: name,
			validationType: type.toLowerCase(),
			validations: parsedRules,
		};

		return config;
	});
}

// TODO: Will convert the data to a Schema
function transformToSchema(data) {
	const schema = fields.reduce((schema, field) => {
		const {
			name,
			validationType,
			validationTypeError,
			validations = [],
		} = field;
		const isObject = name.indexOf('.') >= 0;

		if (!yup[validationType]) {
			return schema;
		}
		let validator = yup[validationType]().typeError(
			validationTypeError || '',
		);
		validations.forEach((validation) => {
			const { params, type } = validation;
			if (!validator[type]) {
				return;
			}
			validator = validator[type](...params);
		});

		if (!isObject) {
			return schema.concat(yup.object().shape({ [name]: validator }));
		}

		const reversePath = name.split('.').reverse();
		const currNestedObject = reversePath.slice(1).reduce(
			(yupObj, path, index, source) => {
				if (!isNaN(path)) {
					return {
						array: yup.array().of(yup.object().shape(yupObj)),
					};
				}
				if (yupObj.array) {
					return { [path]: yupObj.array };
				}
				return { [path]: yup.object().shape(yupObj) };
			},
			{ [reversePath[0]]: validator },
		);

		const newSchema = yup.object().shape(currNestedObject);
		return schema.concat(newSchema);
	}, yup.object().shape({}));

	return schema;
}

// TODO: Those two will be exposed
export const composeSchema = (data, transformer) => {
	if (!!Object.keys(data).length) return false;

	const transformedData = transformer(data);

	console.log({ transformedData });

	return;
};

// TODO: Will contrast the data against the schema
export const validate = ({ schema, data }) => {};
