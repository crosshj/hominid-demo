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

const MenuItem = ({ item, i, selected, onItemClick }) => {
	let props = item;
	try {
		const { properties } = item;
		for (const [k, v] of properties.split(',').map((x) => x.split(':'))) {
			props[k.trim()] = v.trim();
		}
	} catch (e) {}
	const { label, key, href } = props;
	const isSelected = selected === href;
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
				onClick={(e) => onItemClick(e, { href })}
			>
				{label}
			</a>
		</li>
	);
};
export const Menu = (menuArgs) => {
	const { selected, closeMobileMenuFn: onItemClick } = menuArgs;

	const items = getMenuItems(menuArgs);
	if (!Array.isArray(items)) return null;

	let selectedOrDefault;
	if (selected) {
		selectedOrDefault = '#/' + selected;
	} else {
		selectedOrDefault = items[0]?.href;
	}

	const MapMenuItem = (item, i) =>
		MenuItem({ item, i, selected: selectedOrDefault, onItemClick });
	return <ul>{items.map(MapMenuItem)}</ul>;
};
