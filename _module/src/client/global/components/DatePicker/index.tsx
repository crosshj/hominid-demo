import { TextField } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { useData } from '../../hooks/useData.js';

export const DatePicker = ({
	id,
	useData: useDataKey,
	label,
	gridVariant = 'half',
	readOnly = false,
	...props
}: any) => {
	const { data, setData } = useData({ key: useDataKey });

	const handleChange = (e: any) => setData(e.target.value);
	return (
		<MuiDatePicker
			label={label}
			value={data}
			onChange={handleChange}
			readOnly={readOnly}
			renderInput={(params) => (
				<TextField
					{...params}
					disabled={readOnly}
					{...props}
					sx={{ width: '100%' }}
				/>
			)}
		/>
	);
};
