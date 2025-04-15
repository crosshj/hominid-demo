import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';
//import { gridVariantMap } from '../utils/grid';
import { useData } from '../../hooks/useData.js';

export const Checkbox = ({
	id,
	label,
	gridVariant,
	value,
	useData: useDataKey,
	'data-name': dataName,
	fontSize: myFontSize,
	...rest
}: any) => {
	//const gridProps = gridVariantMap[gridVariant];
	const key = dataName ? `${useDataKey}.${dataName}` : useDataKey;

	const { data = false, setData } = useData({ key });

	const handleToggle = (e: any) => {
		setData(!data || e.target.checked);
	};

	const isDisabled = !key;

	const sx = {
		'& .MuiSvgIcon-root': { fontSize: myFontSize ? myFontSize : 32 },
	};

	return (
		<FormControlLabel
			control={
				<MuiCheckbox
					inputProps={{
						'data-testid': `checkbox-${key}`,
					}}
					checked={data}
					onChange={handleToggle}
					disabled={isDisabled}
					sx={sx}
					{...rest}
				/>
			}
			sx={{
				'&	.MuiFormControlLabel-label': {
					width: 'max-content !important',
				},
			}}
			label={label}
		/>
	);
};
