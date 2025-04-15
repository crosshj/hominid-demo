import { Menu as MenuIcon, ViewColumnRounded } from '@mui/icons-material';
import {
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Toolbar,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { StateManager } from '../../../state/state';
import { Icon } from '../Icon';
import { WeekPicker } from '../WeekPicker';

const actionsMap = {
	readCSV: ['download_rounded', 'Export CSV'],
	readPDF: ['download_rounded', 'Download PDF'],
	search: ['search_rounded', 'Search'],
	date: ['calendar_today_rounded', 'Date'],
	week: ['calendar_today_rounded', 'Week Selector'],
	filter: ['filter_list_rounded', 'Filter'],
	width: ['view_column_rounded', 'Width'],
	density: ['density_medium_rounded', 'Density'],
};

export const TableToolbar = ({
	title = '',
	actions,
	handleOpenColumnFilter,
	weekPickerName,
	weekPickerQuery,
	disableWeekPicker,
}: any) => {
	const [search, setSearch]: any = StateManager.useListener('search', '');
	const [isSearchOpen, setSearchOpen] = useState(actions.includes('search'));
	const [anchorEl, setAnchorEl] = useState(undefined);
	const [isWeekSelectorOpen, setWeekSelectorOpen] = useState(
		actions.includes('week'),
	);
	const open = Boolean(anchorEl);

	const handleSearch = (e: any) => setSearch(e?.target?.value || '');
	const handleOpen = (event: any) => setAnchorEl(event?.currentTarget);
	const handleClose = () => setAnchorEl(undefined);
	const handleClick = (action: any) => () => {
		switch (action) {
			case 'search':
				setSearchOpen(!isSearchOpen);
				break;
			case 'week':
				setWeekSelectorOpen(!isWeekSelectorOpen);
				break;
			default:
				alert('Action not available yet!');
		}
	};

	const menuContent = (
		<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
			{actions &&
				actions?.length > 0 &&
				actions?.map((action: any, index: any) => {
					const [icon, label] = (actionsMap as any)[action];
					return icon ? (
						<MenuItem
							key={`icon-${index}`}
							onClick={handleClick(action)}
						>
							<Stack
								direction="row"
								justifyContent="space-between"
							>
								<Icon>{icon}</Icon>
								<Typography>{label}</Typography>
							</Stack>
						</MenuItem>
					) : undefined;
				})}
		</Menu>
	);

	return (
		<Toolbar sx={{ padding: '0!important', marginBottom: '10px' }}>
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{ width: '100%', flexGrow: 1 }}
			>
				<Typography variant="h2" sx={{ width: 'fit-content' }}>
					{title}
				</Typography>

				<Stack
					direction="row"
					justifyContent="space-between"
					spacing={1}
				>
					{isWeekSelectorOpen && weekPickerName && (
						<WeekPicker
							name={weekPickerName}
							targetQuery={weekPickerQuery}
							disableWeekPicker={disableWeekPicker}
						/>
					)}
					{isSearchOpen && (
						<TextField
							value={search}
							onChange={handleSearch}
							label="Search"
							placeholder="Type to search"
						/>
					)}
					{handleOpenColumnFilter && (
						<IconButton onClick={handleOpenColumnFilter}>
							<ViewColumnRounded />
						</IconButton>
					)}
					{actions?.length > 0 && (
						<IconButton onClick={handleOpen}>
							<MenuIcon />
						</IconButton>
					)}
				</Stack>
				{menuContent}
			</Stack>
		</Toolbar>
	);
};
