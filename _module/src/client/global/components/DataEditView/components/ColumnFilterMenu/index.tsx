import { FormControlLabel, Menu, Stack, Switch } from '@mui/material';

export const ColumnFilterMenu = ({
	anchorEl,
	open,
	columns,
	handleClose,
	handleToggleShowColumn,
}: any) => {
	return (
		<Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
			{columns?.map((col: any, index: any) => {
				return (
					<Stack
						key={'column-filter-' + index}
						direction="row"
						alignItems="center"
						spacing={2}
						sx={{ px: 2 }}
					>
						<FormControlLabel
							disabled={col?.disabled}
							control={<Switch checked={col?.visible} />}
							onChange={(e: any) => {
								handleToggleShowColumn(
									col.label,
									e.target.checked,
								);
								handleClose();
							}}
							label={col.label}
						/>
					</Stack>
				);
			})}
		</Menu>
	);
};
