import { Step, StepLabel } from '@mui/material';
import _ from 'lodash';

export const Stepper = ({ propsIntact, propsFilled }: any) => {
	const children = _.get(propsIntact, '_src.children', []);

	const childrenShimmed = children.map(({ label }: any) => {
		return (
			<Step key={label}>
				<StepLabel>{label}</StepLabel>
			</Step>
		);
	});
	let activeStep = 0;
	try {
		activeStep = Number(_.get(propsFilled, 'activeStep'));

		const activeStepFromState = Number(_.get(propsFilled, 'activeStep'));
		activeStep = Number.isNaN(activeStepFromState)
			? 0
			: activeStepFromState;

		if (_.isNumber(propsIntact.startingIndex)) {
			activeStep = activeStep - propsIntact.startingIndex;
		}
	} catch (e) {}

	const propsShimmed = { activeStep };

	return { propsShimmed, childrenShimmed };
};
