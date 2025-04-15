import { renderMode } from '../../utils';

export const buildColumns = (columns = []) =>
	columns
		.filter((x) => x.type.toLowerCase() === 'column')
		.map((x) => {
			const { key, label, children } = x;
			const { variant = 'text', flex, ...rest } = x?.props || {};
			const field = key.split('.').pop();
			return {
				...rest,
				label,
				children,
				field,
				headerName: x?.label,
				renderCell: renderMode[variant] || renderMode['text'],
				maxWidth: '1000',
				flex: flex || 1,
			};
		});
