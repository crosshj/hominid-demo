import CloseIcon from '@mui/icons-material/Close';
import { Dialog as Modal, DialogContent, IconButton } from '@mui/material';
import { StateManager } from '../../../state/state';
import { runFlow } from '../_MUI/core/runFlow';
import { UserSnapButton } from '../../utils/UserSnapButton';

const CloseButton = ({ handleClose, hideCloseButton }: any) => {
	return (
		<IconButton
			aria-label="close"
			onClick={handleClose}
			sx={{
				position: 'absolute',
				right: 8,
				top: 8,
				color: (theme) => theme.palette.grey[500],
				display: hideCloseButton ? 'none' : '',
			}}
		>
			<CloseIcon />
		</IconButton>
	);
};

export const Dialog = (props: any) => {
	const {
		debug,
		useData: key,
		children,
		height = '90%',
		minHeight,
		maxHeight,
		width = '80%',
		onCloseHref = '',
		hideCloseButton = false,
		modalOnly = false,
	} = props;
	const [data, setData]: any = StateManager.useListener(key, false);

	if (!!data) {
		UserSnapButton.show();
	} else {
		UserSnapButton.hide();
	}

	if (debug) {
		console.log({
			_: 'Dialog debug',
			props,
			data,
		});
	}

	const handleClose = () => {
		runFlow({ propsIntact: { debug, href: onCloseHref } });
		setData(false);
	};
	const fixDim = (dim: any) => {
		return (dim + '').includes('%' || 'px') ? dim : dim + 'px';
	};

	if (modalOnly) {
		return (
			<Modal
				fullWidth={true}
				open={!!data}
				PaperProps={{
					style: {
						minHeight: fixDim(minHeight || height),
						maxHeight: fixDim(maxHeight || height),
						minWidth: fixDim(width),
						maxWidth: fixDim(width),
					},
				}}
			>
				<CloseButton {...{ handleClose, hideCloseButton }} />
				{children}
			</Modal>
		);
	}

	return (
		<Modal
			fullWidth={true}
			open={!!data}
			PaperProps={{
				style: {
					minHeight: fixDim(minHeight || height),
					maxHeight: fixDim(maxHeight || height),
					minWidth: fixDim(width),
					maxWidth: fixDim(width),
				},
			}}
		>
			<DialogContent>
				<CloseButton {...{ handleClose, hideCloseButton }} />
				{children}
			</DialogContent>
		</Modal>
	);
};
