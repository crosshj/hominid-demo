import { useState, Fragment } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

export function PositionedSnackbar() {
	const [state, setState]: any = useState({
		open: false,
		vertical: 'top',
		horizontal: 'center',
	});
	const { vertical, horizontal, open } = state;

	const handleClick = (newState: any) => () => {
		setState({ open: true, ...newState });
	};

	const handleClose = () => {
		setState({ ...state, open: false });
	};

	const buttons = (
		<Fragment>
			<Button
				onClick={handleClick({
					vertical: 'top',
					horizontal: 'center',
				})}
			>
				Top-Center
			</Button>
			<Button
				onClick={handleClick({
					vertical: 'top',
					horizontal: 'right',
				})}
			>
				Top-Right
			</Button>
			<Button
				onClick={handleClick({
					vertical: 'bottom',
					horizontal: 'right',
				})}
			>
				Bottom-Right
			</Button>
			<Button
				onClick={handleClick({
					vertical: 'bottom',
					horizontal: 'center',
				})}
			>
				Bottom-Center
			</Button>
			<Button
				onClick={handleClick({
					vertical: 'bottom',
					horizontal: 'left',
				})}
			>
				Bottom-Left
			</Button>
			<Button
				onClick={handleClick({
					vertical: 'top',
					horizontal: 'left',
				})}
			>
				Top-Left
			</Button>
		</Fragment>
	);

	return (
		<div>
			{buttons}
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				onClose={handleClose}
				message="I love snacks"
				key={vertical + horizontal}
			/>
		</div>
	);
}
