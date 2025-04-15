import _ from 'lodash';
import { StateManager } from '../../../state/state';
import { validate } from '../Validator';
import { toast } from 'react-toastify';

const getDataObj = (dataPath: string | undefined, { flowArgs }: any = {}) => {
	if (!_.isString(dataPath)) return undefined;

	if (dataPath.startsWith('global_')) {
		return StateManager.get(dataPath.replace('global_', ''));
	}

	if (dataPath.startsWith('flowArgs.')) {
		return _.get({ flowArgs }, dataPath);
	}

	return undefined;
};

export const Validate = (props: any) => {
	const {
		debug,
		schema: schemaPath,
		data: dataPath,
		errors: errorsPath,
		onStep,
		onExit,
		flowArgs,
	} = props;

	const schema = StateManager.get(schemaPath);
	const data = getDataObj(dataPath, { flowArgs });

	if (debug) {
		console.log({
			_: 'Validate: debug',
			schemaPath,
			schema,
			dataPath,
			data,
		});
	}

	// null, undefined or NOT AN OBJECT
	for (const [k, v] of Object.entries({ schema, data })) {
		if (_.isNil(v) || !_.isObject(v)) {
			console.error({
				_: `Validate: ${k} is required and must be an object`,
			});
			onExit && onExit();
			return null;
		}
	}

	setTimeout(async () => {
		try {
			const { errors: newErrors = {} } = validate({ schema, data });

			if (debug) {
				console.log({
					_: 'Validate: debug',
					errorsPath,
					newErrors,
				});
			}

			StateManager.update(errorsPath, newErrors);
			const thereAreErrors =
				Object.keys((newErrors as any) || {}).length > 0;
			if (thereAreErrors) {
				return onExit && onExit();
			}
			onStep && onStep();
		} catch (e) {
			console.log(
				'Schema validation failed',
				{ schemaPath, dataPath, schema, data },
				{ error: e },
			);

			if (window.location.origin.startsWith('http://localhost')) {
				toast.error(
					`You provided an invalid schema for ${schemaPath}. More information on the console`,
				);
			}
		}
	}, 1);

	return null;
};
