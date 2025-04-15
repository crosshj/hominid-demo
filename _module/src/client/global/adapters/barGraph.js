import { StateManager } from '../../state/state';
import { BarGraph } from '../components/BarGraph';
import { getBarChartData } from '../services/getBarChartData';
import { useCallback, useEffect, useState } from 'react';

const sortResults = (results = [], reverse) => {
	results
		.sort((a, b) =>
			reverse
				? Number(b?.order) - Number(a?.order)
				: Number(a?.order) - Number(b?.order),
		)
		.map((x, i) => (x.order = i));
};

export const BarGraphAdapter = ({ label, props }) => {
	const { targetQuery, format, hasCard, value } = props || {};
	const [loading, setLoading] = useState(false);

	const [state, setState] = StateManager.useListener(undefined, undefined, {
		note: 'global/adapters/barGraph',
	});
	const { barCharts = {} } = state;

	const data = barCharts[targetQuery] || [];
	const sortedData = data?.sort((a, b) => {
		return Number(a.order) - Number(b.order);
	});
	const getData = useCallback(async () => {
		if (!targetQuery) return;
		setLoading(true);
		const response = await getBarChartData(targetQuery);
		const results = (response.ContextProc?.[0]?.results || []).map((x) => {
			const properties = (x.properties || '')
				.split(',')
				.reduce((all, one = '') => {
					const [k, v] = one.split(':');
					if (!k || !v) return all;
					return { ...all, [k.trim()]: `${v.trim()}` };
				}, {});
			return { ...x, ...properties };
		});
		sortResults(results, props?.reverse + '' === 'true');

		setState((state) => {
			const barCharts = {
				...(state.barCharts || {}),
				[targetQuery]: results,
			};
			return { ...state, barCharts };
		});
		setLoading(false);
	}, [targetQuery, props, setState]);

	useEffect(() => {
		getData(targetQuery);
	}, [targetQuery, getData]);

	return {
		targetQuery,
		format,
		label,
		hasCard,
		loading,
		value,
		data: sortedData,
		Component: BarGraph,
	};
};

export const barGraphAdapter = BarGraphAdapter;
