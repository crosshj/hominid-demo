import {
	Container,
	Box,
	Stack,
	Button,
	Typography,
	TextField,
	Divider,
} from '@mui/material';

import { Table } from '../components/Table';
import { Snackbar } from '../components/Snackbar';
import { PositionedSnackbar } from '../components/SnackbarDemo';

/*----------------------------------------------------------------
table
cards
*/

export const UiKit = () => {
	return (
		<Container>
			<Stack alignItems="flex-start" spacing={6} my={10}>
				<Box>
					<Typography variant="h4" color="primary" my={2}>
						Colors
					</Typography>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Button variant="contained" color="primary">
							Primary
						</Button>
						<Button variant="contained" color="secondary">
							Secondary
						</Button>
						<Button variant="contained" color="info">
							Info
						</Button>
						<Button variant="contained" color="error">
							Error
						</Button>

						<Button variant="contained" color="warning">
							Warning
						</Button>

						<Button variant="contained" color="success">
							Success
						</Button>
					</Stack>
				</Box>

				<Divider />

				<Box my={3}>
					<Typography variant="h4" mb={2} color="primary">
						Buttons
					</Typography>
					<Stack direction="row" alignItems="center" spacing={2}>
						<Button variant="text">Text</Button>
						<Button variant="outlined">Outlined</Button>
						<Button variant="contained">Contained</Button>
					</Stack>
				</Box>
				<Divider />
				<Box my={3}>
					<Typography variant="h4" mb={2}>
						Text Fields
					</Typography>
					<Stack spacing={3}>
						<TextField label="Outlined" />
						<TextField label="Filled" variant="filled" />
						<TextField label="Standard" variant="standard" />

						<TextField label="Password" type="password" />
						<TextField
							label="With Helper text"
							helperText="Some important text"
						/>
						<TextField
							label="Multiline(good for notes)"
							multiline
						/>
					</Stack>
				</Box>
				<Divider />
				<Box>
					<Typography variant="h4" color="primary">
						Typography
					</Typography>
					<Typography variant="h1">Typography H1</Typography>
					<Typography variant="h2">Typography h2</Typography>
					<Typography variant="h3">Typography h3</Typography>
					<Typography variant="h4">Typography h4</Typography>
					<Typography variant="h5">Typography h5</Typography>
					<Typography variant="h6">Typography h6</Typography>
					<Typography variant="subtitle1">
						Typography subtitle1
					</Typography>
					<Typography variant="subtitle2">
						Typography subtitle2
					</Typography>
					<Typography variant="body1">Typography body1</Typography>
					<Typography variant="body2">Typography body2</Typography>
				</Box>
				<Divider />
			</Stack>
			<Stack>
				<Typography variant="h4" color="primary" mb={3}>
					Table
				</Typography>
				<Table />
				<Divider />
				<Box my={4}>
					<Typography variant="h4" color="primary" mb={3}>
						Snackbars
					</Typography>
					<PositionedSnackbar />
					<Snackbar severity="success" message="Success message" />
					<Snackbar severity="error" message="Error message" />
					<Snackbar severity="info" message="Info message" />
					<Snackbar severity="success" message="Success message" />
				</Box>
			</Stack>
		</Container>
	);
};
