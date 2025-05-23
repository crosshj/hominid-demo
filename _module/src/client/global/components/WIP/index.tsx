import { Alert, Typography } from '@mui/material';
import { Button } from '../Button';
import * as S from './styles';
import { StateManager } from '../../../state/state';
import { Link } from '../../../router';

export const WIP = ({
	menu,
	link,
	wip = 'true',
	handleReset,
	navigate = true,
}: any) => {
	const [previousMenu]: any = StateManager.useListener('previousMenu');
	const parsedTitle = () => {
		return menu
			.split('.')
			.pop()
			.split(/(?=[A-Z][a-z])/)
			.join(' ');
	};
	let navigation: any = wip ? (
		<Button type="navigate" target={link || previousMenu?.target}>
			Back
		</Button>
	) : (
		<Link to="root.dashboard">
			<Button type="navigate" target="root" onClick={handleReset}>
				Back to dashboard
			</Button>
		</Link>
	);
	if (navigate + '' === 'false') {
		navigation = null;
	}
	return (
		<S.WIP spacing={4}>
			<S.Title variant="h1">{menu && parsedTitle()}</S.Title>
			<svg viewBox="0 0 978 952">
				<path d="M520.289,1.967c-1.615,4.413-14.747,7.465-31.096,7.465c-16.88,0-30.314-4.884-31.217-8.822l-76.571,214.588h-0.018  c0.037,17,48.295,30.526,107.535,30.526c59.236,0,107.535-13.084,107.535-29.72v-0.005L520.289,1.967z" />
				<path d="M897.207,691.268l-148.072-45.49l34.283,96.421h-0.003c-0.099,46-131.985,82.708-294.66,82.708  c-162.679,0-294.562-36.708-294.663-82.708h0.055l34.278-96.406L80.652,691.284C-6.557,718.129-27.55,764.646,41.001,795.37  l282.491,126.619c89.181,39.971,241.994,40.025,331.121,0.096l282.621-126.606C1005.879,764.728,984.701,718.146,897.207,691.268z" />
				<path d="M655.997,381.461c-4.879,11.841-21.986,22.058-50.218,29.847c-31.25,8.622-72.838,13.37-117.103,13.37   c-44.28,0-85.87-4.857-117.109-13.678c-27.324-7.715-44.232-17.743-49.711-29.335l-69.411,194.533h-0.043   c0.08,35,106.409,66.121,236.528,66.121c130.117,0,236.528-29.668,236.528-66.207v-0.012L655.997,381.461z" />
			</svg>

			<Alert severity={wip ? 'info' : 'error'}>
				<Typography variant="h2">
					{wip ? 'Work In Progress' : 'Something went wrong'}
				</Typography>
			</Alert>
			{navigation}
		</S.WIP>
	);
};
