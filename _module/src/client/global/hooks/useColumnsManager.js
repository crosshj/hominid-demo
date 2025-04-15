import { buildColumns } from '../components/DataEditView/helpers/buildColumns';
import { useState } from 'react';

export const useColumnsManager = (children, rowMatrix, dispatch) => {
	const columns = buildColumns(children, rowMatrix, dispatch) || [];

	const [columnsToShow, setColumnsToShow] = useState({});

	const visibleColumns = columns.filter(
		(c) => !c.hideable || columnsToShow[c.label],
	);
	const hiddenHideableColumns = columns.filter(
		(c) => c.hideable && !columnsToShow[c?.label],
	);

	const columnsVisibilityState = columns.map((c) => {
		return {
			label: c.label,
			disabled: !c.hideable,
			visible: !c.hideable || columnsToShow[c.label],
		};
	});

	const handleToggleShowColumn = (label, value) => {
		setColumnsToShow((s) => {
			return { ...s, [label]: value };
		});
	};

	return {
		columns,
		columnsToShow,
		visibleColumns,
		hiddenHideableColumns,
		columnsVisibilityState,
		handleToggleShowColumn,
	};
};
