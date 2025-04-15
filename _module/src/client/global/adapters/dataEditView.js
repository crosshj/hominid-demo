import { DataEditView } from '../components/DataEditView';
import { BranchTable } from '../components/BranchTable';
import { NestedTable } from '../components/NestedTable';
import { useTable } from '../hooks/useTable';

const DataEditViewAdapter = (args) => {
	const { type } = args;
	const table = useTable(args);
	const Component =
		{
			BranchTable,
			DataEditView,
			NestedTable,
		}[type] || DataEditView;
	return { ...table, Component };
};

export const dataEditViewAdapter = DataEditViewAdapter;
