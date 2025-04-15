import { v4 as uuidv4 } from 'uuid';
import { graphQLClient } from '../../../framework/api';
import query from './query.gql';
import { StateManager } from '../../../state/state';

let menusLoading = false;

const isVisible = ({ showOn } = {}) => {
	try {
		//NOTE: permissive here, a stark contrast from isVisible in Alert component
		if (typeof showOn !== 'string') return true;
		if (showOn.trim() === '*') return true;
		const showList = ('//localhost,' + showOn)
			.split(',')
			.map((x) => x.trim());
		const shouldShow = showList.find((x) =>
			document.location?.href.includes(x),
		);
		return shouldShow;
	} catch (e) {
		return typeof showOn !== 'string';
	}
};
const parsePropsString = ({ properties } = {}) => {
	try {
		return (properties || '').split(',').reduce(
			(a, o) => ({
				[o.split(':')[0].trim()]: o.split(':')[1].trim(),
				...a,
			}),
			{},
		);
	} catch (e) {
		return {};
	}
};

const filterMenus = ({ results, menuMap }) => {
	try {
		const menusToShow = (results || [])
			.filter((x) => x.key !== 'root')
			.filter((x) => {
				const parsedProps = parsePropsString(x);
				return isVisible(parsedProps);
			})
			.map(menuMap);
		return menusToShow;
	} catch (e) {
		console.log(e);
	}
};

export const getMenus = async ({ state, setState, menuMap }) => {
	if (menusLoading) return [];

	menusLoading = true;
	const { ContextProc = [] } = await graphQLClient.request(query, {
		tag: `menu:root`,
		input: [
			{
				name: 'ui.sp_UIContextGetComponentsByUserID',
				uuid: uuidv4(),
				args: JSON.stringify({
					key: 'root',
				}),
			},
		],
	});

	const { results } = ContextProc[0] || {};
	StateManager.update('menus', filterMenus({ results, menuMap }));
	menusLoading = false;
};
