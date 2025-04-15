import { StepButtons } from '../components/StepButtons';

export const stepButtonsAdapter = ({ label, props }) => {
	return {
		Component: StepButtons,
		label,
		...props,
	};
};
