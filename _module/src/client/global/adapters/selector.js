import { TableSelector } from '../components/TableSelector';
import { actionsList } from '../utils';

export const selectorAdapter = ({ children, props }) => {
	const { targetQuery } = props;

	const options = children.map((child) => {
		const actions =
			Object.entries(child.props || {})?.reduce((acc, [label, value]) => {
				if (actionsList.includes(label) && value) {
					acc.push(label);
				}
				return acc;
			}, []) || []; //final format: ['readCSV', 'readPDF'] if readCSV and readPDF are true

		const { props, ...rest } = child;
		return {
			actions,
			...props,
			...rest,
		};
	});

	return { Component: TableSelector, options, targetQuery };
};
