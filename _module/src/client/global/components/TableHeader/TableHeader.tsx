import { IconButton } from '@mui/material';
import { useState } from 'react';
import { Icon } from '../Icon';
import { StateManager } from '../../../state/state';

const FilterButtonStyles = {
	selected: {
		color: '#616161',
		backgroundColor: '#eee',
	},
	notSelected: {
		color: '#616161',
		backgroundColor: '',
	},
};

const hasSelectedFilterValues = ({ filterValue = '' }) => {
	if (!filterValue) return false;

	const stateFilterValue =
		StateManager.get(filterValue.replace('global_', '')) || {};

	return Object.values(stateFilterValue).some((v) => v !== null);
};

export const TableHeader = (props: any) => {
	const [optionsOpen, setOptions] = useState(false);

	const { children } = props;

	const groupedChildren = {} as any;
	for (const child of children) {
		const { for: purpose } = child.props.props;
		groupedChildren[purpose] = groupedChildren[purpose] || [];
		groupedChildren[purpose].push(child);
	}

	const hiderClick = (e: any) => {
		e.nativeEvent.stopImmediatePropagation();
		e.stopPropagation();
		setOptions(!optionsOpen);
		return false;
	};

	const filterButtonStyle =
		optionsOpen || hasSelectedFilterValues(props)
			? FilterButtonStyles.selected
			: FilterButtonStyles.notSelected;

	return (
		<div
			style={{
				marginBottom: '1em',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '1em',
				}}
			>
				<div>{groupedChildren.title}</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '0.5em',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						display: 'flex',
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						gap: '0.5em',
					}}
				>
					{groupedChildren.search}
				</div>

				<IconButton
					size="large"
					onClick={hiderClick}
					sx={{
						backgroundColor: filterButtonStyle.backgroundColor,
					}}
				>
					<Icon
						icon="filter_list_rounded"
						color={filterButtonStyle.color}
					/>
				</IconButton>
				<div style={{ minWidth: '20%' }}>{groupedChildren.sort}</div>
			</div>
			<div
				style={{
					display: optionsOpen ? 'flex' : 'none',
					flexDirection: 'column',
					gap: '1em',
					marginTop: '0.75em',
				}}
			>
				Filter Options
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '1em',
					}}
				>
					{groupedChildren.filter}
				</div>
			</div>
		</div>
	);
};
