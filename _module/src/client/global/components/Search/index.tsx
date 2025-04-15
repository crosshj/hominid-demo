import { Grid, TextField } from '@mui/material';
import { useData } from '../../hooks/useData';
import { debounce } from '../../utils/debounce';
import { gridVariantMap } from '../utils/grid';

export const Search = ({
	label,
	gridVariant = 'full',
	grid = true,
	useData: useDataProp,
	...props
}: any) => {
	const gridProps = (gridVariantMap as any)[gridVariant];
	const { setData } = useData({ key: useDataProp });

	const inputProps = {
		fullWidth: true,
		...props,
	};

	const debouncedSetData = debounce(setData, 1000);

	const updateState = (e: any) => {
		debouncedSetData(e.target.value);
	};

	if (!grid) {
		return (
			<TextField
				{...inputProps}
				label={label}
				onChange={updateState}
			></TextField>
		);
	}

	return (
		<Grid {...gridProps}>
			<TextField
				{...inputProps}
				label={label}
				onChange={updateState}
			></TextField>
		</Grid>
	);
};
