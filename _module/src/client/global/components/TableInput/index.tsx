import {
	CircularProgress,
	InputAdornment,
	MenuItem,
	TextField,
} from '@mui/material';
import { useOptions } from '../../hooks/useOptions';

export const TableInput = ({
	value,
	select,
	loading,
	OptionListKey: targetQuery,
	skipQuery,
}: any) => {
	const options = useOptions({ targetQuery, skipQuery });

	return (
		<TextField
			value={value}
			SelectProps={{
				MenuProps: {
					sx: { maxHeight: 400 },
				},
			}}
			InputProps={{
				endAdornment: loading && select && (
					<InputAdornment position="end">
						<CircularProgress />
					</InputAdornment>
				),
			}}
		>
			{options &&
				options?.length > 0 &&
				options?.map((option: any) => (
					<MenuItem key={option?.value} value={option?.value}>
						{option?.label}
					</MenuItem>
				))}
		</TextField>
	);
};
