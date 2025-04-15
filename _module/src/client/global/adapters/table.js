import { Table } from '../components/Table';
import { actionsList } from '../utils/actionsList';

export const tableAdapter = ({ label, props, ...rest }) => {
	const actions =
		Object.entries(props)?.reduce((acc, [label, value]) => {
			if (actionsList.includes(label) && value === 'true') {
				acc.push(label);
			}
			return acc;
		}, []) || []; //final format: ['readCSV', 'readPDF'] if readCSV and readPDF are true

	return {
		label,
		actions,
		...props,
		...rest,
		Component: Table,
	};
};
