import { StateManager } from '../../state/state';
import { DataListView } from '../components/DataListView';
import { renderMode } from '../components/utils/renderMode';
import { useMount } from '../hooks/useMount';
import { getData } from '../services/getData';

const DataListViewAdapter = (args) => {
	const [state] = StateManager.useListener(undefined, undefined, {
		note: 'global/adapters/dataListView',
	});
	const [{ param } = {}] = StateManager.useListener('menu', undefined, {
		note: 'global/adapters/dataListView',
	});
	const [loading] = StateManager.useListener('loading', undefined, {
		note: 'global/adapters/dataListView',
	});

	const { label, props = {} } = args;
	const { dataKey, paramName, source, buttonLabel, buttonTarget } = props;

	const getRows = async (queryArgs) => {
		await getData('listView', queryArgs, undefined, source);
	};
	useMount(() => {
		const queryArgs = {};
		if (dataKey) {
			queryArgs.key = dataKey;
		}
		if (paramName && typeof param !== 'undefined') {
			queryArgs[paramName] = param;
		}
		getRows(queryArgs);
	});

	const columns = (args.children || [])
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

	const rows = state[source] || [];

	for (const row of rows) {
		for (const col of columns) {
			if (!col.children) continue;
			const cases = col.children.filter(
				(x) => x.type.toLowerCase() === 'case',
			);
			const trueCase = cases.find(
				(x) => x.props.when === row[x.props.property],
			);
			if (!trueCase) continue;
			row[col.name] = { ...row[col.name], ...trueCase.props };
		}
	}

	return {
		label,
		rows,
		columns,
		loading,
		buttonLabel,
		buttonTarget,
		Component: DataListView,
	};
};

export const dataListViewAdapter = DataListViewAdapter;
