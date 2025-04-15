import { Box } from '@mui/material';
import { StepButtons } from '../StepButtons';

export const Step = ({
	previousButtonLabel = 'Back',
	nextButtonLabel = 'Continue',
	children,
	isLastStep = false,
	handleBack,
	handleForward,
}: any) => {
	return (
		<>
			<Box>{children}</Box>
			{!isLastStep && (
				<StepButtons
					previousButtonLabel={previousButtonLabel}
					nextButtonLabel={nextButtonLabel}
					handleBack={handleBack}
					handleForward={handleForward}
				/>
			)}
		</>
	);
};
