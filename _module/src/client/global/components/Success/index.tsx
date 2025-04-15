import { Typography, Stack } from '@mui/material';
import { Button } from '../Button';
import { SuccessStack, SuccessIcon, ErrorIcon } from './style';
import { StateManager } from '../../../state/state';

export const Success = ({
	successLabel,
	errorLabel,
	successText = '',
	errorText = '',
	rightButtonSuccessText,
	leftButtonSuccessText,
	rightButtonErrorText,
	leftButtonErrorText,
	leftButtonSuccessRoute,
	rightButtonSuccessRoute,
	leftButtonErrorRoute,
	rightButtonErrorRoute,
	status = 'success',
}: any) => {
	const [results]: any = StateManager.useListener('results');
	const isSuccess =
		(results && results === 'success') || status === 'success';

	const label = isSuccess ? successLabel : errorLabel;
	const text = isSuccess ? successText : errorText;
	const rightButtonText = isSuccess
		? rightButtonSuccessText
		: rightButtonErrorText;
	const leftButtonText = isSuccess
		? leftButtonSuccessText
		: leftButtonErrorText;
	const rightButtonRoute = isSuccess
		? rightButtonSuccessRoute
		: rightButtonErrorRoute;
	const leftButtonRoute = isSuccess
		? leftButtonSuccessRoute
		: leftButtonErrorRoute;

	return (
		<SuccessStack alignItems="center" justifyContent="center">
			{isSuccess ? (
				<SuccessIcon fontSize="large" />
			) : (
				<ErrorIcon fontSize="large" />
			)}
			<Typography variant="h3" sx={{ marginBottom: 4 }}>
				{label}
			</Typography>
			{text && (
				<Typography
					variant="h4"
					style={{
						whiteSpace: 'pre-line',
						textAlign: 'center',
					}}
					sx={{ marginBottom: 4 }}
				>
					{text.replace(/\\n/g, '\n')}
				</Typography>
			)}
			<Stack
				alignItems="center"
				direction="row"
				spacing={2}
				sx={{ mt: 2 }}
			>
				{leftButtonText && (
					<Button
						variant="outlined"
						color={isSuccess ? 'success' : 'error'}
						type="navigate"
						target={leftButtonRoute}
					>
						{leftButtonText}
					</Button>
				)}
				{rightButtonText && (
					<Button
						variant="primary"
						color={isSuccess ? 'success' : 'error'}
						type="navigate"
						target={rightButtonRoute}
					>
						{rightButtonText}
					</Button>
				)}
			</Stack>
		</SuccessStack>
	);
};
