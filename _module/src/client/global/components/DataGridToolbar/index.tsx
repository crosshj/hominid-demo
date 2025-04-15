import * as S from './styles';
import {
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarExport,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { Box } from '@mui/material';

export const DataGridToolbar = () => {
	return (
		<S.DataGridToolbar>
			<GridToolbarContainer>
				<GridToolbarColumnsButton />
				<GridToolbarFilterButton />
				<GridToolbarDensitySelector />
				<GridToolbarExport />
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<GridToolbarQuickFilter />
				</Box>
			</GridToolbarContainer>
		</S.DataGridToolbar>
	);
};
