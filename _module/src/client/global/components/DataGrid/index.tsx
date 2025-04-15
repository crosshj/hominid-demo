import * as S from './styles';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

import { DataGridToolbar } from '../DataGridToolbar';

export const DataGrid = ({ rows, headers, ...dataGridProps }: any) => {
	return (
		<S.Container>
			<MuiDataGrid
				rows={rows}
				headers={headers}
				checkboxSelection={true}
				components={{
					Toolbar: DataGridToolbar,
				}}
				{...dataGridProps}
			/>
		</S.Container>
	);
};
