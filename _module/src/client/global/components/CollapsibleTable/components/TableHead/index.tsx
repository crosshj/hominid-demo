import React, { useState } from 'react';
import { TableRow, IconButton, Icon } from '@mui/material';
import { TableCell } from './styles';
import {
	Download,
	KeyboardArrowDown,
	KeyboardArrowUp,
} from '@mui/icons-material';
// import { TalentRow } from '../TalentRow';

export const TableHead = ({ row, isVisible }) => {
	const [open, setOpen] = useState(isVisible);
	const visible = isVisible ? 'visible' : 'collapse';
	return (
		<>
			<TableRow
				sx={{
					'& > *': {
						color: '#FFF!important',
					},
					background: '#2e3d78',
					visibility: visible,
					transition: 'visibility 0.1s',
				}}
			>
				<TableCell colSpan={3}>{row.name}</TableCell>
				<TableCell>{row.qtyPaid}</TableCell>
				<TableCell>{row.totalPaid}</TableCell>
				<TableCell>{row.qtyBilled}</TableCell>
				<TableCell>{row.totalBilled}</TableCell>
				<TableCell>
					<IconButton aria-label="expand row" size="small">
						<Download sx={{ color: '#FFF' }} />
					</IconButton>
				</TableCell>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<KeyboardArrowUp sx={{ color: '#FFF' }} />
						) : (
							<KeyboardArrowDown sx={{ color: '#FFF' }} />
						)}
					</IconButton>
				</TableCell>
			</TableRow>
			{/* {row.talents?.map((talent) => (
				<TalentRow
					isVisible={open && isVisible}
					key={`talent-${talent.name}`}
					row={talent}
				/>
			))} */}
		</>
	);
};
