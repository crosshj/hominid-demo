import { useState } from 'react';
import './Menu.css';

const getMenuItems = ({ items }) => {
	let menuItems = items;
	try {
		const fromSession = sessionStorage.getItem('menuItems');
		const fromSessionParsed = JSON.parse(fromSession);
		if (Array.isArray(fromSessionParsed)) {
			menuItems = fromSessionParsed;
		}
		if (Array.isArray(items) && items.length) {
			sessionStorage.setItem('menuItems', JSON.stringify(items));
		}
	} catch (e) {}
	return menuItems;
};

const MenuItem = ({ item, i, selected, setSelected }) => {
	const { label, key } = item;
	const isSelected = selected === key;
	const className = Object.entries({
		selected: isSelected,
	})
		.filter(([k, v]) => !!v)
		.map(([k, v]) => k)
		.join(' ');
	return (
		<li
			key={`menu-item-` + i}
			className={className}
		>
			<a
				href={key}
				onClick={() => setSelected(key)}
			>
				{label}
			</a>
		</li>
	);
};
export const Menu = (menuArgs) => {
	const [selected, setSelected] = useState('/' + document.location.hash);
	const items = getMenuItems(menuArgs);
	const MapMenuItem = (item, i) =>
		MenuItem({ item, i, selected, setSelected });
	if (!Array.isArray(items)) return null;
	return <ul>{items.map(MapMenuItem)}</ul>;
};
