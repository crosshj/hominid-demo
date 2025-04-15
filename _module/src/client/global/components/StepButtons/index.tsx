import { Button } from '@mui/material';
import { ActionStack, Title } from './style.js';

export const StepButtons = ({
	previousButtonLabel = '',
	nextButtonLabel = '',
	handleBack,
	handleForward,
}: any) => {
	return (
		<ActionStack direction="row">
			<Title variant="button" onClick={handleBack}>
				{previousButtonLabel}
			</Title>

			<Button variant="contained" color="primary" onClick={handleForward}>
				{nextButtonLabel}
			</Button>
		</ActionStack>
	);
};
