import { Stack } from '@mui/material';
import { ToggleButtonGroup } from '../ToggleButtonGroup';
import { StateManager } from '../../../state/state';

export const TableSelector = ({ targetQuery, options, children }: any) => {
	const [selectedListView]: any =
		StateManager.useListener('selectedListView');

	// const selectedOption = options.find(
	// 	(option) => option.targetQuery === selectedListView
	// );
	const filteredChildren = children.find(
		(child: any) => child?.props?.props?.targetQuery === selectedListView,
	);
	return (
		<Stack py={2} spacing={4}>
			<ToggleButtonGroup
				options={options}
				defaultTargetQuery={targetQuery}
			/>
			{filteredChildren}
			{/* <Table {...selectedOption} /> */}
		</Stack>
	);
};
