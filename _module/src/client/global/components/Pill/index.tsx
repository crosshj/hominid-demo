import { Chip } from '@mui/material';
import { Icon } from '../Icon';
import { useData } from '../../hooks/useData';
import { getColor } from '../../utils/getColor';

export const Pill = ({ useData: useDataKey, children }: any) => {
	const { data: value } = useData({ key: useDataKey });

	const cases = children
		.filter((x: any) => x.props.type.toLowerCase() === 'case')
		.map(
			({
				props: {
					props: { when = '', color = '', icon = '' } = {},
				} = {},
			} = {}) => ({
				when,
				color,
				icon,
			}),
		);

	const thisCase = cases.find(
		({ when }: any) => when.toLowerCase() === value?.toLowerCase(),
	) ||
		cases.find((x: any) => x.when === '???') || {
			when: '',
			color: '#fff0',
			icon: '',
		};

	return (
		<Chip
			label={thisCase.when.toUpperCase()}
			color="primary"
			style={{ backgroundColor: getColor(thisCase.color) }}
			size="small"
			icon={<Icon icon={thisCase.icon} />}
		/>
	);
};
