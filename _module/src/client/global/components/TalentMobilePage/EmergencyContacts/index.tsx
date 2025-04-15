import { Button, Card, Typography } from '@mui/material';
import { Icon } from '../../Icon';
import { MobileEmergencyContacts } from './style';

const EmergencyContacts = (props: any) => {
	const { relationship, contactName } = props;

	return (
		<>
			<Card>
				<MobileEmergencyContacts>
					<Typography variant="h5">{relationship}</Typography>
					<Typography variant="h3">{contactName}</Typography>
					<Button
						fullWidth
						size="large"
						variant="outlined"
						color="primary"
					>
						<Icon sx={{ mr: 1 }} color={'primary'} icon={'Phone'} />
						{'Call'}
					</Button>
					<Button
						fullWidth
						size="large"
						variant="outlined"
						color="primary"
					>
						<Icon sx={{ mr: 1 }} color={'primary'} icon={'Email'} />
						{'Email'}
					</Button>
				</MobileEmergencyContacts>
			</Card>
		</>
	);
};

export default EmergencyContacts;
