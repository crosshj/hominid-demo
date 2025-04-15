import { Button, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Icon } from '../Icon';
import EmergencyContacts from './EmergencyContacts';
import { MobileProfile } from './style';

const TalentMobilePage = () => {
	const [stateLabel, setStateLabel] = useState('');
	const [assignedRecruiter, setAssignedRecruiter] = useState('');
	const [cardInfo, setCardInfo] = useState('');
	const [emergencyContacts, setEmergencyContacts] = useState([
		{
			relationship: 'test1',
			contactName: 'test1',
			phoneNumber: 'test1',
			email: 'test1',
		},
		{
			relationship: 'test2',
			contactName: 'test2',
			phoneNumber: 'test2',
			email: 'test2',
		},
		{
			relationship: 'test3',
			contactName: 'test3',
			phoneNumber: 'test3',
			email: 'test3',
		},
	]);

	const selectRecruiter = [
		{ label: 'test1', value: 'test1' },
		{ label: 'test2', value: 'test2' },
		{ label: 'test3', value: 'test3' },
	];

	const selectState = [
		{ label: 'test1', value: 'test1' },
		{ label: 'test2', value: 'test2' },
		{ label: 'test3', value: 'test3' },
	];

	const selectCard = [
		{ label: 'test1', value: 'test1' },
		{ label: 'test2', value: 'test2' },
		{ label: 'test3', value: 'test3' },
	];

	const addNewEmergencyContact = () => {
		const newEmergencyContacts = [...emergencyContacts];
		newEmergencyContacts.push({
			relationship: `test${emergencyContacts.length + 1}`,
			contactName: `test${emergencyContacts.length + 1}`,
			phoneNumber: `test${emergencyContacts.length + 1}`,
			email: `test${emergencyContacts.length + 1}`,
		});
		setEmergencyContacts(newEmergencyContacts);
	};

	return (
		<>
			<MobileProfile>
				<TextField fullWidth label="First Name" />
				<TextField fullWidth label="Last Name" />

				<Typography variant="h2">{'Contact Info'}</Typography>
				<TextField fullWidth label="Phone Number" />
				<TextField fullWidth label="Email Address" />
				<TextField
					fullWidth
					label="Assigned Recruiter"
					select
					value={assignedRecruiter}
					onChange={(e) => setAssignedRecruiter(e.target.value)}
				>
					{selectRecruiter.map((item) => (
						<MenuItem key={item.value} value={item.value}>
							{item.label}
						</MenuItem>
					))}
				</TextField>

				<Typography variant="h2">{'Location Info'}</Typography>
				<TextField fullWidth label="Address" />
				<TextField fullWidth label="Zip Code" />
				<TextField fullWidth label="City" />
				<TextField
					fullWidth
					label="State"
					select
					value={stateLabel}
					onChange={(e) => setStateLabel(e.target.value)}
				>
					{selectState.map((item) => (
						<MenuItem key={item.value} value={item.value}>
							{item.label}
						</MenuItem>
					))}
				</TextField>

				<Typography variant="h2">{'Payment Info'}</Typography>
				<TextField
					fullWidth
					label="Card"
					select
					value={cardInfo}
					onChange={(e) => setCardInfo(e.target.value)}
				>
					{selectCard.map((item) => (
						<MenuItem key={item.value} value={item.value}>
							{item.label}
						</MenuItem>
					))}
				</TextField>

				<Typography variant="h2">{'Emergency Contacts'}</Typography>
				{emergencyContacts.map((item) => (
					<EmergencyContacts
						relationship={item.relationship}
						contactName={item.contactName}
						phoneNumber={item.phoneNumber}
						email={item.email}
					/>
				))}

				<Button
					fullWidth
					onClick={addNewEmergencyContact}
					size="large"
					variant="outlined"
					color="primary"
					sx={{ borderStyle: 'dashed' }}
				>
					<Icon
						sx={{ mr: 0.25, fontSize: '1rem' }}
						color="primary"
						icon={'Add'}
					/>
					{'Create Another Contact'}
				</Button>

				<Button
					sx={{ mb: 6 }}
					fullWidth
					size="large"
					variant="contained"
					color="primary"
				>
					{'edit'}
				</Button>
			</MobileProfile>
		</>
	);
};

export default TalentMobilePage;
