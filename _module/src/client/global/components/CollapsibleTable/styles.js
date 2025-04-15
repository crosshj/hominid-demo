import {
	Card as MuiCard,
	TableCell as MuiTableCell,
	TableRow as MuiTableRow,
	styled,
} from '@mui/material';

const getColors = ({ type, theme }) => {
	const color = {
		branch: {
			backgroundColor: theme.palette.grey[300],
		},
		client: {
			backgroundColor: theme.palette.grey[500],
			color: theme.palette.grey[50],
		},
		talent: {
			backgroundColor: theme.palette.grey[700],
			color: theme.palette.grey[50],
		},
	}[type];

	return (
		color || {
			backgroundColor: theme.grey,
		}
	);
};

export const Card = styled(MuiCard)(getColors);

export const TableRow = styled(MuiTableRow)(({ type, theme }) => ({
	// width: '100%',
}));

export const TableCell = styled(MuiTableCell)(({ type, theme }) => ({
	...getColors({ type, theme }),
	// width: '100%',
	// minWidth: '100px',
}));
