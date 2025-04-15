import {
	Stack,
	Step,
	StepLabel,
	Stepper as MuiStepper,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { Step as StepFunction } from '../Step';
import { StateManager } from '../../../state/state';
import { useGlobal } from '../../hooks/useGlobal';
import { useMount } from '../../hooks/useMount';

export const Stepper = ({ children = [] } = {}) => {
	const steps =
		children.filter(
			(child: any) =>
				child.type === StepFunction || child.props.type === 'Step',
		) || [];

	const [selectedStep = 0]: any = StateManager.useListener('selectedStep');
	const [previousMenu]: any = StateManager.useListener('previousMenu');
	const { navigate }: any = useGlobal();

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const step = steps[selectedStep] as any;
	const isLastStep = selectedStep + 1 === steps?.length;

	const handleBack = () => {
		if (selectedStep === 0) {
			navigate(previousMenu);
		} else {
			StateManager.update('selectedStep', selectedStep - 1);
		}
	};

	const handleForward = () => {
		StateManager.update('selectedStep', selectedStep + 1);
	};

	useMount(() => {
		StateManager.update('selectedStep', 0);
	});

	if (steps.length === 0) return null;
	const Component = step.type || step.props.type;

	return (
		<Stack spacing={2} justifyContent="center">
			<MuiStepper
				activeStep={selectedStep}
				orientation={isMobile ? 'vertical' : 'horizontal'}
				sx={{ p: 2 }}
			>
				{steps.map((step, index) => (
					<Step key={index}>
						<StepLabel>
							{(step as any)?.props?.label || ''}
						</StepLabel>
					</Step>
				))}
			</MuiStepper>
			<Component
				{...step.props}
				handleBack={handleBack}
				handleForward={handleForward}
				isLastStep={isLastStep}
			>
				{step?.props?.children}
			</Component>
		</Stack>
	);
};
