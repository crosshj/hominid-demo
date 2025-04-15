import _ from 'lodash';
import * as M from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { addSpacesToCamelCase } from '../../utils';
import { withRunFlowProps } from '../../../framework/core/withRunFlowProps';

const getMappedRoles = ({ roles, rolesMap }: any) => {
	try {
		const mappedRoles = roles
			.filter((x: any) => x.roleId in rolesMap)
			.map((x: any) => ({
				...x,
				roleName: rolesMap[x?.roleId]?.key,
				roleDashboard: rolesMap[x?.roleId]?.dashboard,
			}));
		return _.uniqBy(mappedRoles, 'roleDashboard');
	} catch (e) {
		console.warn({
			_: "UserRolesTabs: Error mapping user's roles with roleMap",
			roles,
			rolesMap,
		});

		return {};
	}
};

const Tabs = ({ selected, onChange, tabs }: any) => {
	const handleChange = (_e: any, selectedValue: any) => {
		const isClickingOnCurrentSelectedTab = selectedValue === null;
		if (isClickingOnCurrentSelectedTab) return;

		onChange(selectedValue)();
	};
	return (
		<M.ToggleButtonGroup
			color="secondary"
			value={selected}
			onChange={handleChange}
			fullWidth
			exclusive
		>
			{tabs.map((x: any, i: any) => (
				<M.ToggleButton key={'tabs-' + i} value={x.roleName}>
					{addSpacesToCamelCase(x.roleDashboard)}
				</M.ToggleButton>
			))}
		</M.ToggleButtonGroup>
	);
};

export function UserRolesTabs(args: any = {}) {
	const { roles, rolesMap } = args;

	const [showTabs, setShowTabs] = useState<any[]>([]);
	const [selectedTab, setSelected] = useState<String>();
	const { onSelect }: any = withRunFlowProps({ propsIntact: args });

	const updateParent = useCallback(() => {
		const dashboard = showTabs.find(
			(x) => x.roleName === selectedTab,
		).roleDashboard;
		onSelect({ selectedTab: dashboard });
	}, [onSelect, showTabs, selectedTab]);

	// notifies parent when selectedTab changes
	useEffect(() => {
		if (typeof selectedTab === 'undefined') return;
		if (typeof onSelect !== 'function') {
			console.warn({
				_: "UserRolesTabs: component requires a function named 'onSelect'; check params!",
			});
			return;
		}
		updateParent();
	}, [selectedTab]);

	// auto-selects first role
	useEffect(() => {
		const mappedRoles = getMappedRoles({ roles, rolesMap });
		if (typeof selectedTab !== 'undefined') return;
		if (!Array.isArray(mappedRoles)) return;
		setSelected(mappedRoles[0].roleName);
		setShowTabs(mappedRoles);
	}, [onSelect, selectedTab, roles, rolesMap]);

	const onClick = (roleName: String) => () => setSelected(roleName);

	if (!showTabs.length || showTabs.length === 1) return null;

	return <Tabs selected={selectedTab} onChange={onClick} tabs={showTabs} />;
}
