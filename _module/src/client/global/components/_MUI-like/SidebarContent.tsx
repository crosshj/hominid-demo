import { format } from 'date-fns';
import { useState } from 'react';

import {
	Box,
	Button,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { Icon as MuiIcon } from '@mui/material';
import {
	Assignment,
	ChevronLeft,
	ChevronRight,
	ExpandLess,
	ExpandMore,
	InfoRounded,
	MessageRounded,
} from '@mui/icons-material';

import { Icon } from '../Icon';

import { withRunFlowProps } from '../../../framework/core/withRunFlowProps';

function useToggleDrawer(key = 'drawerOpen-right', initialValue = true) {
	const [isOpen, setIsOpen] = useState<boolean>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});
	const toggleIsOpen = () => {
		try {
			setIsOpen((currentIsOpen) => {
				const newIsOpen = !currentIsOpen;
				window.localStorage.setItem(key, JSON.stringify(newIsOpen));
				return newIsOpen;
			});
		} catch (error) {
			console.log(error);
		}
	};
	return [isOpen, toggleIsOpen] as const;
}

function RecordIcon({ record }: { record: RecordItem }) {
	const style = { fontSize: '1.1rem' };
	if (record.variant === 'error') {
		return (
			<MuiIcon sx={{ color: 'error.light' }} style={style}>
				errorfilled
			</MuiIcon>
		);
	}
	if (record.variant === 'success') {
		return <Assignment style={style} sx={{ color: 'success.light' }} />;
		// return (
		// 	<CheckCircleRounded style={style} sx={{ color: 'success.light' }} />
		// );
	}
	if (record.variant === 'info') {
		return <MessageRounded style={style} sx={{ color: 'default.light' }} />;
	}
	return <InfoRounded style={style} sx={{ color: 'default.light' }} />;
}

interface RecordItem {
	variant: 'success' | 'error' | 'info';
	name: string;
	type: string;
	createdDate: string;
	createdby: string;
	snippet: string;
	recordid?: string;
	record_id?: string;
	recordID?: string;
	recordId?: string;
}
interface RecordArgs {
	handleRecordClick: (record: RecordItem) => () => void;
	record: RecordItem;
}
function Record(args: RecordArgs) {
	const { handleRecordClick, record } = args;
	return (
		<div
			style={{
				position: 'relative',
				padding: '3px 6px',
			}}
		>
			{/* background trick, cause Alert's are not flexible enough */}
			<Box
				sx={{
					backgroundColor: `${record.variant}.light`,
					borderRadius: '6px',
				}}
				style={{
					opacity: 0.12,
					position: 'absolute',
					inset: 0,
					pointerEvents: 'none',
				}}
			/>

			<Box
				onClick={handleRecordClick(record)}
				sx={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto',
					gridTemplateRows: 'auto auto auto',
					backgroundColor: 'transparent',
					fontSize: '0.75rem',
					cursor: 'pointer',
				}}
			>
				<div
					className="flex items-center justify-center"
					style={{ marginRight: '5px' }}
				>
					<RecordIcon {...{ record }} />
				</div>
				<Typography variant="body2" fontWeight={600}>
					{record.name}
				</Typography>
				<Typography
					variant="body2"
					sx={{ gridColumn: '2 / span 2', gridRow: 2 }}
				>
					{record.snippet}
				</Typography>
				<Typography
					variant="body2"
					sx={{ gridColumn: '2 / span 2', gridRow: 3 }}
					fontSize="0.7rem"
				>
					{format(new Date(record.createdDate), 'MM/dd/yy')} -{' '}
					{record.type}
				</Typography>
			</Box>
		</div>
	);
}

interface CollapsedSidebarArgs {
	toggleDrawer: () => void;
	expanded: ExpandedTypes;
	setExpanded: (newValue: ExpandedTypes) => void;
}
function CollapsedSidebar(args: CollapsedSidebarArgs) {
	const handleRecordsClick = () => {
		args.setExpanded('records');
		args.toggleDrawer();
	};
	const handleToolsClick = () => {
		args.setExpanded('toolbox');
		args.toggleDrawer();
	};
	return (
		<div
			className="flex-column"
			style={{
				width: 'var(--sidebar-right-collapsed-width)',
				marginTop: '8px',
				height: '100%',
				paddingBottom: '0.25em',
			}}
		>
			<div>
				<ListItemButton
					onClick={handleRecordsClick}
					style={{
						minHeight: '56px',
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex',
					}}
				>
					<ListItemIcon>
						<Icon icon="assignment" />
					</ListItemIcon>
				</ListItemButton>
			</div>
			<div>
				<ListItemButton
					onClick={handleToolsClick}
					style={{
						minHeight: '56px',
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex',
					}}
				>
					<ListItemIcon>
						<Icon icon="construction" />
					</ListItemIcon>
				</ListItemButton>
			</div>
			<div
				style={{
					marginTop: 'auto',
				}}
			>
				<ListItemButton
					onClick={args.toggleDrawer}
					style={{
						minHeight: '56px',
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex',
					}}
				>
					<ListItemIcon>
						<ChevronLeft />
					</ListItemIcon>
				</ListItemButton>
			</div>
		</div>
	);
}

interface OpenSidebarArgs {
	flowArgs: Record<string, any>;
	records: RecordItem[] | 'loading';
	runFlow: Record<string, (flowArgs: Record<string, any>) => void>;
	toggleDrawer: () => void;
	expanded: ExpandedTypes;
	setExpanded: (newValue: ExpandedTypes) => void;
}
function OpenSidebar(args: OpenSidebarArgs) {
	const { records, toggleDrawer, expanded, setExpanded, runFlow } = args;
	const handleExpand = () => {
		if (expanded === 'records') setExpanded('toolbox');
		if (expanded !== 'records') setExpanded('records');
	};
	const handleRecordClick = (record: RecordItem) => () => {
		const possiblePropsForId = [
			'record_id',
			'recordid',
			'recordID',
			'recordId',
		] as const;

		for (const maybeIdProp of possiblePropsForId) {
			if (typeof record[maybeIdProp] !== 'undefined') {
				runFlow.recordClick({
					...args.flowArgs,
					recordID: record[maybeIdProp],
				});
				break;
			}
		}
	};

	const handleRecordAdd = () => {
		runFlow.recordAdd(args.flowArgs);
	};
	const handleRecordsView = () => {
		runFlow.recordsView(args.flowArgs);
	};

	return (
		<div
			className="flex-column"
			style={{
				width: 'var(--sidebar-right-width)',
				height: '100%',
				overflowY: 'hidden',
				marginTop: '8px',
				paddingBottom: '0.25em',
			}}
		>
			<div>
				<ListItemButton
					onClick={handleExpand}
					style={{
						minHeight: '56px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ListItemIcon>
						<Icon icon="assignment" />
					</ListItemIcon>
					<ListItemText primary="Records" />
					{expanded === 'records' ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
			</div>
			<Box
				style={{
					height: '100%',
					flex: expanded === 'records' ? 1 : 0,
					display: expanded === 'records' ? 'flex' : 'none',
					flexDirection: 'column',
					overflowY: 'hidden',
				}}
			>
				<div
					style={{
						overflowY: 'auto',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.25em',
						flex: 1,
						padding: '0.5em',
						paddingBottom: '300px', //overscroll
					}}
				>
					{Array.isArray(records) &&
						records.map((record, i) => (
							<Record
								{...{ record, handleRecordClick, key: i }}
							/>
						))}
					{records === 'loading' && (
						<Box
							style={{
								marginTop: '1em',
								display: 'flex',
								justifyContent: 'center',
							}}
							sx={{ color: 'text.disabled' }}
						>
							loading...
						</Box>
					)}
					{records !== 'loading' &&
						(!Array.isArray(records) || !records?.length) && (
							<Box
								style={{
									marginTop: '1em',
									display: 'flex',
									justifyContent: 'center',
								}}
								sx={{ color: 'text.disabled' }}
							>
								No results
							</Box>
						)}
				</div>
				<div
					style={{
						marginTop: 'auto',
						paddingTop: '1em',
					}}
				>
					<Button
						onClick={handleRecordAdd}
						variant="text"
						color="success"
						style={{
							width: '100%',
						}}
					>
						Create New Record
					</Button>
				</div>
				<div
					style={{
						paddingBottom: '1em',
					}}
				>
					<Button
						onClick={handleRecordsView}
						variant="text"
						color="secondary"
						style={{
							width: '100%',
						}}
					>
						View All Records
					</Button>
				</div>
			</Box>

			<div
				style={{
					borderTop: '1px solid #8883',
				}}
			>
				<ListItemButton
					onClick={handleExpand}
					style={{
						minHeight: '56px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ListItemIcon>
						<Icon icon="construction" />
					</ListItemIcon>
					<ListItemText primary="Toolbox" />
					{expanded === 'toolbox' ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
			</div>
			<Box
				style={{
					height: '100%',
					flex: expanded === 'toolbox' ? 1 : 0,
					display: expanded === 'toolbox' ? 'flex' : 'none',
					flexDirection: 'column',
					overflowY: 'hidden',
				}}
			>
				{/* TODO: figure out how tools work */}
				<Box
					style={{
						marginTop: '1em',
						display: 'flex',
						justifyContent: 'center',
					}}
					sx={{ color: 'text.disabled' }}
				>
					No tools available.
				</Box>
			</Box>

			<div
				style={{
					borderTop: '1px solid #8883',
				}}
			>
				<ListItemButton
					onClick={toggleDrawer}
					style={{
						minHeight: '56px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ListItemIcon>
						<ChevronRight />
					</ListItemIcon>
					<ListItemText primary="Close" />
				</ListItemButton>
			</div>
		</div>
	);
}

interface SidebarContentArgs {
	records: RecordItem[] | 'loading';
	recordAdd: string;
	recordClick: string;
	recordsView: string;
	flowArgs: Record<string, any>;
	_src: Record<string, any>;
}
type ExpandedTypes = 'records' | 'toolbox';
export function SidebarContent(
	args: SidebarContentArgs = {} as SidebarContentArgs,
) {
	const [expanded, setExpanded] = useState<ExpandedTypes>('records');

	const [drawerOpen, toggleDrawer] = useToggleDrawer();
	const flowRunners: any = withRunFlowProps({
		propsIntact: args,
		propsFilled: {},
	});

	if (!drawerOpen) {
		return (
			<CollapsedSidebar
				toggleDrawer={toggleDrawer}
				expanded={expanded}
				setExpanded={setExpanded}
			/>
		);
	}

	return (
		<OpenSidebar
			flowArgs={args.flowArgs}
			records={args.records}
			runFlow={flowRunners}
			toggleDrawer={toggleDrawer}
			expanded={expanded}
			setExpanded={setExpanded}
		/>
	);
}
