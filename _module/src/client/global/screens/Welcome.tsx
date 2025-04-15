import { Stack, Typography, Button } from '@mui/material';
import { SplashScreen } from '../../global/layouts';

export const WelcomeScreen = () => {
	const returnTo = (document as any).location.pathname;
	return (
		<SplashScreen>
			<Stack
				direction="column"
				justifyContent="center"
				spacing={2}
				mt={4}
				id="welcome-screen"
			>
				<a href={`/api/auth/login?returnTo=${returnTo}`}>
					<Stack>
						<Button variant="contained" color="primary">
							Login
						</Button>
					</Stack>
				</a>
				<a href="/api/auth/register">
					<Stack>
						<Button color="secondary">
							<Typography variant="button" color="white">
								Register
							</Typography>
						</Button>
					</Stack>
				</a>
			</Stack>
		</SplashScreen>
	);
};
