import { Link, Button, Stack, Alert, Typography } from '@mui/material';
import * as S from './styles';

export const WelcomeError = ({ error }: any) => {
	return (
		<S.Container>
			<Stack spacing={2}>
				<div
					className="flex-column items-center justify-center"
					style={{
						gap: '1em',
						padding: '1em',
						background: 'white',
						color: 'black',
						borderRadius: '5px',
						marginLeft: '-1em',
					}}
				>
					<Alert severity="error">{error}</Alert>
					<Typography>
						An error has occurred. Please log out and try again.
					</Typography>
					<Link href="/api/auth/logout">
						<Button variant="contained">Log Out</Button>
					</Link>
				</div>
			</Stack>
		</S.Container>
	);
};
