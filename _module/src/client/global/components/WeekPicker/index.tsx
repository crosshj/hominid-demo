import { TextField } from '@mui/material';
//import { generateWeeks } from '../utils/generateWeeks';
import { StateManager } from '../../../state/state';
import { useOptions } from '../../hooks/useOptions';

export function WeekPicker({ name, targetQuery, disableWeekPicker }: any) {
	const optionsList = useOptions({ targetQuery } as any);
	const options = optionsList || [{ value: 0, label: '' }];

	const [value = 0, setSelectedOption]: any = StateManager.useListener(name);

	// const getDates = () => {
	// 	return generateWeeks(5);
	// };
	const handleChange = (e: any) => {
		if (!name) return;
		setSelectedOption(e?.target?.value);
	};

	return (
		<TextField
			id="outlined-select-currency-native"
			select
			label="Week End"
			SelectProps={{
				native: true,
			}}
			disabled={disableWeekPicker}
			value={value}
			onChange={handleChange}
		>
			{options.length > 0 &&
				options?.map((option: any) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
		</TextField>
	);
}
