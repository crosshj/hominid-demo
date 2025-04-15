import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ChevronRight, ChevronLeft } from '@mui/icons-material';

export const MenuToggleControl = ({ open, handleToggleDrawer }: any) => {
	if (open) {
		return (
			<div
				style={{
					borderTop: '1px solid #8883',
					marginTop: 'auto',
				}}
			>
				<ListItemButton
					onClick={handleToggleDrawer}
					style={{
						minHeight: '56px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ListItemIcon>
						<ChevronLeft />
					</ListItemIcon>
					<ListItemText primary="Close" />
				</ListItemButton>
			</div>
		);
	}

	return (
		<div
			style={{
				borderTop: '1px solid transparent',
				marginTop: 'auto',
			}}
		>
			<ListItemButton
				onClick={handleToggleDrawer}
				style={{
					minHeight: '56px',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
				}}
			>
				<ListItemIcon>
					<ChevronRight />
				</ListItemIcon>
			</ListItemButton>
		</div>
	);
};
