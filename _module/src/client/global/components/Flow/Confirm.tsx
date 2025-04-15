import * as M from '@mui/material';
import { clone } from '../../utils';
import { StateManager } from '../../../state/state';
import { replaceTokens } from '../../utils/parseProperties';

export const Confirm = (props: any) => {
	const {
		title: titleSrc,
		textContent: textSrc,
		alertText,
		onExit,
		flowArgs,
		onStep,
		debug,
		whiteSpace = 'pre',
	} = props;

	const state = clone(StateManager.get());

	Object.assign(state, {
		flowArgs: clone(flowArgs),
	});

	const title = replaceTokens(state, String(titleSrc));
	const textContent = replaceTokens(state, String(textSrc));

	const decline = () => {
		onExit && onExit();
	};
	const confirm = () => {
		onStep && onStep();
	};

	if (debug) {
		console.log({ _: 'Confirm:debug', flowArgs, title, textContent });
	}
	return (
		<M.Dialog open onClose={decline} fullWidth>
			<M.DialogTitle>{title}</M.DialogTitle>
			<M.DialogContent sx={{ whiteSpace }}>{textContent}</M.DialogContent>
			<M.DialogActions>
				{!alertText && (
					<M.Button
						variant="outlined"
						onClick={decline}
						color="secondary"
					>
						No
					</M.Button>
				)}
				<M.Button variant="contained" onClick={confirm} color="primary">
					{alertText || 'Yes'}
				</M.Button>
			</M.DialogActions>
		</M.Dialog>
	);
};
