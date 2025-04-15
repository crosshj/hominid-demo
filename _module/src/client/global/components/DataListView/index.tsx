import { Box, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '../Button';

export const DataListView = ({
	rows,
	columns,
	label,
	loading,
	buttonLabel,
	buttonTarget,
}: any) => {
	return (
		<Box
			sx={{
				minHeight: '400',
				height: '100%',
				overflowX: 'auto',
			}}
		>
			<Grid
				container
				direction="row"
				justifyContent="space-between"
				alignItems="space-between"
			>
				<Grid item>
					<Typography variant="h2" sx={{ my: 2 }}>
						{label}
					</Typography>
				</Grid>
				<Grid item>
					<Button
						label={buttonLabel}
						target={buttonTarget}
						type="navigate"
					/>
				</Grid>
			</Grid>

			<DataGrid
				sx={{ height: '70vh' }}
				loading={loading}
				rows={rows}
				columns={columns}
			/>
		</Box>
	);
};
