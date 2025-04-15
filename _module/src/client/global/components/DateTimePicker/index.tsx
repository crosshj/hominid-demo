import * as M from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker as DTP } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';

export const DateTimePicker = (args) => {
	const { children, context, id, order, ...props } = args;
	const [value, setValue] = useState(null);

	const onChange = (newValue) => {
		setValue(newValue);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DTP
				{...props}
				value={value}
				onChange={onChange}
				renderInput={(params) => (
					<M.TextField
						{...params}
						helperText={params?.inputProps?.placeholder}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};
