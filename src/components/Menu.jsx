import { useState, useContext } from 'react';
import './Menu.css';
import { MobileMenuContext } from './MenuMobile';

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

const MenuItem = ({ item, i, selected, onItemClick }) => {
	let props = item;
	try {
		const { properties } = item;
		for (const [k, v] of properties.split(',').map((x) => x.split(':'))) {
			props[k.trim()] = v.trim();
		}
	} catch (e) {}
	const { label, key, href } = props;
	const isSelected = selected === key || selected === href;
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
				href={href || key}
				onClick={(e) => onItemClick(e, {href})}
			>
				{label}
			</a>
		</li>
	);
};
export const Menu = (menuArgs) => {
	const [selected, setSelected] = useState(document.location.hash);
	const { setMobileMenu } = useContext(MobileMenuContext);
	const onItemClick = (e, { href }) => {
		console.log('menu item click: href')
		setMobileMenu(false);
		setSelected(href);
	};
	const items = getMenuItems(menuArgs);
	const MapMenuItem = (item, i) =>
		MenuItem({ item, i, selected, onItemClick });
	if (!Array.isArray(items)) return null;
	return <ul>{items.map(MapMenuItem)}</ul>;
};
