import * as I from '@mui/icons-material';
import {
	KeyboardArrowDownRounded,
	KeyboardArrowUpRounded,
} from '@mui/icons-material';

import { IconButton, LinearProgress, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { getGridItems } from './getGridItems';
import { NestedTableContainer, getColumns } from './styles';
import { renderMode } from '../utils';

import { Addons, AddonItem } from './Addons';

import { ExtensibleHeader } from './ExtensibleHeader';
import { getNestingAlt } from '../../utils';
import { getModifiers } from './RowModifiers';

const TableEmpty = ({
	columns,
	isLoading,
}: {
	columns: any[];
	isLoading: boolean;
}) => {
	const gridTemplateColumns = columns.map((_x: any) => 'auto').join(' ');
	const Contents = isLoading ? (
		<div style={{ width: '100%', height: '100%' }}>
			<LinearProgress
				sx={{
					// lineHeight: 'unset',
					lineHeight: 50,
				}}
			/>
		</div>
	) : (
		'No results'
	);
	return (
		<Box>
			<div
				className="nestable-table"
				style={{ gridTemplateColumns, display: 'grid' }}
			>
				{columns.map((col, _i) => {
					return (
						<Typography
							key={_i}
							className="table-header"
							style={{ flex: '1 1 0%' }}
						>
							{col.labelHidden ? '' : col.label}
						</Typography>
					);
				})}
				<div
					className=""
					style={{
						gridColumn: '1/-1',
						paddingTop: '2em',
						paddingBottom: '3em',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{Contents}
				</div>
			</div>
		</Box>
	);
};

const NestHeader = ({ args }: any) => {
	const { level, row, nestingAlt = [] } = args;
	const thisLevelAlt = nestingAlt[level];

	if (args?.extensible) return ExtensibleHeader(args);

	if (thisLevelAlt?.children) {
		const renderCell = renderMode.text;

		let firstDeeplyNestedChild = row.children[0];
		while (true) {
			if (!firstDeeplyNestedChild?.children) break;
			firstDeeplyNestedChild = firstDeeplyNestedChild.children[0];
		}

		return renderCell({
			colDef: thisLevelAlt,
			row: firstDeeplyNestedChild,
		});
	}

	return <></>;
};

const GridItem = (args: any) => {
	const {
		row,
		field,
		value = '',
		label,
		labelHidden,
		gridColumn,
		rowType,
		level,
		className = '',
		isOpen,
		parentOpen,
		handleToggleOpen,
		handleAddNewRow,
		handleUpdateRow,
		renderCell,
		nesting,
		modifiers,
		collapsible,
		_nestId,
	} = args;
	modifiers && console.log({ modifiers });

	if (rowType === 'Addon') {
		const cols = getColumns(args);
		return <AddonItem {...{ ...args, ...cols }} debug={true} />;
	}

	if (label) {
		const hideLabel = typeof labelHidden !== 'undefined';
		return hideLabel ? '' : <Typography>{label}</Typography>;
	}
	if (gridColumn) {
		if (!parentOpen && level !== 0) return '';
		if (rowType === 'header') {
			return <NestHeader args={args} />;
		}
		const { addIcon, addMessage } = nesting?.attributes?.[level] || {};

		if (rowType === 'footer' && addIcon && addMessage) {
			const Icon = (I as any)[addIcon];

			return (
				<div
					className="nest-adder-link"
					onClick={() => handleAddNewRow(args)}
				>
					<Icon />
					<span>{addMessage}</span>
				</div>
			);
		}
		if (!isOpen) return '';
		return ``;
	}
	if (rowType === 'header' && className.includes('actions')) {
		if (collapsible === false || row?.collapsible === false) return <></>;
		return (
			<IconButton
				color="inherit"
				onClick={() => handleToggleOpen(_nestId)}
			>
				{isOpen ? (
					<KeyboardArrowUpRounded />
				) : (
					<KeyboardArrowDownRounded />
				)}
			</IconButton>
		);
	}
	if (renderCell && args.classNameSrc) {
		return (
			<div className={args.classNameSrc}>
				{renderCell({
					value,
					row,
					column: field,
					onChange: handleUpdateRow,
				})}
			</div>
		);
	}
	if (renderCell) {
		return renderCell({
			value,
			row,
			column: field,
			onChange: handleUpdateRow,
		});
	}
	return value;
};

export const NestedTable = (args: any) => {
	const {
		rows = [],
		columns = [],
		dispatch,
		visibleColumns = [],
		isLoading,
		nesting,
		handleAddNewRow,
		handleUpdateRow,
		headerHidden,
		chromeless,
		_src,
	} = args;

	const debug = !['false', 'undefined'].includes(_src?.debug + '');
	const toTotal = (_src?.children || [])
		.filter((x: any) => x?.type === 'Total')
		.map((x: any) => ({
			total: true,
			...(x?.props || {}),
		}));

	const nestingAlt = getNestingAlt(_src);

	let { collapsible } = args;
	if (typeof collapsible === 'undefined') {
		collapsible = false;
	}
	if (nestingAlt[0].param === '*') {
		collapsible = false;
	}

	// TODO: support `open="true" on levels and table`
	// must init open state with all open level items
	const [open, setOpen] = useState({});
	const handleToggleOpen = (id: any) =>
		setOpen({ ...open, [id]: !(open as any)[id] });

	if (collapsible + '' === 'false') {
		nestingAlt.forEach((x: any) => {
			x.collapsible = false;
		});
	}
	const { maxLevel, items } = getGridItems({
		rows,
		open: collapsible + '' === 'false' ? '*' : open,
		visibleColumns,
		dispatch,
		nesting: nestingAlt,
		headerHidden,
		toTotal,
		debug,
	});

	if (debug) {
		console.log({
			_: 'NestedTable',
			rows,
			nesting,
			gridItems: items,
		});
	}

	if (!items.length) return '';

	if (isLoading || !rows.length) {
		return <TableEmpty columns={columns} isLoading={isLoading} />;
	}

	const modifiers = getModifiers(args);
	for (const item of items) {
		for (const modifier of modifiers) {
			modifier.apply(item);
		}
	}

	const renderGridItem = (item: any, i: number) => {
		if (item.extensible) {
			return (
				<GridItem
					key={'column-' + i}
					{...{
						collapsible,
						...item,
						handleToggleOpen,
						handleAddNewRow,
						handleUpdateRow,
						nesting,
						nestingAlt,
						maxLevel,
						visibleColumns,
					}}
				/>
			);
		}
		return (
			<div
				key={'column-' + i}
				className={item.className}
				style={{
					gridColumn: item.gridColumn,
					...(item.style || {}),
				}}
			>
				<GridItem
					{...{
						collapsible,
						...item,
						handleToggleOpen,
						handleAddNewRow,
						handleUpdateRow,
						nesting,
						nestingAlt,
						maxLevel,
						visibleColumns,
					}}
				/>
			</div>
		);
	};

	const classList = ['nestable-table', 'levels-' + maxLevel];
	if (chromeless) {
		classList.push('chromeless');
	}

	return (
		<Box>
			<NestedTableContainer
				{...args}
				className={classList.join(' ')}
				collapsible={collapsible}
				maxLevel={maxLevel}
				visibleColumns={visibleColumns}
			>
				{items?.map((item: any, i: number) => {
					if (Array.isArray(item.cells)) {
						return (
							<div
								className="table-row-container"
								style={item.style || {}}
							>
								{item.cells.map(renderGridItem)}
							</div>
						);
					}
					return renderGridItem(item, i);
				})}
				<Addons
					{...args}
					maxLevel={maxLevel}
					visibleColumns={visibleColumns}
				/>
			</NestedTableContainer>
		</Box>
	);
};
