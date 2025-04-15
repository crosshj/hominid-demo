import { Grid, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';

const gridVariant = {
	full: { xs: 12 },
	half: { xs: 12, md: 6 },
};

export const FormDate = ({ variant = 'half', value, ...props }) => {
	const [date, setDate] = useState(value);
	const [error, setError] = useState(null);
	const handleError = (reason, value) => {
		if (reason) {
			setError(reason);
			return;
		}
		setError(false);
	};
	const gridProps = gridVariant[variant];

	return (
		<Grid item {...gridProps} sx={{ height: '6rem' }}>
			<Stack>
				<DatePicker
					label="Basic example"
					value={date}
					inputFormat="MM/dd/yy"
					onChange={(newValue) => {
						setDate(newValue);
					}}
					onError={handleError}
					renderInput={(params) => <TextField {...params} />}
					{...props}
				></DatePicker>
				{error}
			</Stack>
		</Grid>
	);
};
