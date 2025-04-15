import { ObjectFromIdTree } from '../../../utils/objectFromIdTree';
import { composeYupSchema, validate as validateSchema } from './lib';
import { StateManager } from '../../../../state/state';
import { useMount } from '../../../hooks/useMount';

export function useValidation(key: any) {
	const [globalSchema]: any = StateManager.useListener(`schemas.${key}`);

	const validate = async (genericObj: any) => {
		const config = globalSchema;
		if (!config) return 'no config';
		const schema = composeYupSchema({ [key]: { ...config } });
		if (!schema) return 'no schema ';

		const result = await validateSchema(schema, genericObj);
		// console.log({
		// 	schema,
		// 	config,
		// 	toValidate: genericObj,
		// 	result,
		// });
		return result;
	};

	return {
		validate,
	};
}

export const Schema = (argsSrc: any = {}) => {
	const [schemas = {}, setSchemas]: any = StateManager.useListener('schemas');

	useMount(() => {
		const { name } = argsSrc;
		const configObj = ObjectFromIdTree(argsSrc._src, 'Schema');

		if (!name) return;
		if (!configObj) return;

		setSchemas({
			...schemas,
			[name]: configObj,
		});
	});

	// const { validate } = useValidation(configObj);

	// const attemptValidate = validate({
	// 	username: 'Potato',
	// 	password: 'somebigrandomhash',
	// 	age: 18,
	// 	newsletter: true,
	// });

	// console.log(
	// 	'%cFeature/DataValidation >>>',
	// 	'color: #fff;background:red',
	// 	attemptValidate
	// );

	return null;
};
