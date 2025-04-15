import { useGlobal } from './useGlobal';
import { submitFormData } from '../services';
import { toast } from 'react-toastify';
import { buildInputFromData, filterDataKeys } from '../components/Form/helpers';
import { useData } from './useData';
import { StateManager } from '../../state/state';

export const useForm = ({
	useDataConfig,
	targetRedirect,
	hasMultipleTargets,
	submitTarget,
	formDefinition,
}) => {
	// const [loading, setLoading] = StateManager.useListener('loading');
	const [formData, setFormData] = StateManager.useListener(useDataConfig);
	// const [results, setResults] = StateManager.useListener('results');

	const { dispatch } = useGlobal();

	const handleSubmit = async (data) => {
		StateManager.update('loading', true);

		const input = hasMultipleTargets
			? buildInputFromData(data, submitTarget)
			: [
					{
						name: submitTarget,
						uuid: '',
						args: JSON.stringify({
							...filterDataKeys(data, formDefinition),
						}),
					},
			  ];

		try {
			const response = await toast.promise(submitFormData(input), {
				pending: 'Submitting data...',
				success: 'Form submitted successfully!',
				error: "Couldn't submit data",
			});
			//console.log('response', response);
			//saves each result set on [name] inside state.results
			const theseResults = response.reduce(
				({ name, results }, resultsObj) => {
					resultsObj[name] = JSON.parse(results);
					return resultsObj;
				},
				{},
			);
			StateManager.update('results', { ...results, ...theseResults });
			// setResults({ ...results, ...theseResults });
			if (targetRedirect) {
				dispatch({ type: 'navigate', target: targetRedirect });
			}
		} catch (err) {
			console.error('error', err);
		}
		StateManager.update('loading', false);
	};

	return {
		formData,
		setFormData: (...args) => {
			console.log('set form data');
			console.log({ args });
			setFormData(...args);
		},
		handleSubmit,
	};
};
