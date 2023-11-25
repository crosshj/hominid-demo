import './Menu.css';

const MenuItem = (item, i) => {
	const { label, key, selected } = item;
	const className = Object.entries({
		selected,
	})
		.filter(([k, v]) => !!v)
		.map(([k, v]) => k)
		.join(' ');
	//console.log(item);
	return (
		<li
			key={`menu-item-` + i}
			className={className}
		>
			<a href={key}>{label}</a>
		</li>
	);
};
export const Menu = (menuArgs) => {
	const selected = '/' + document.location.hash;
	const { items } = menuArgs;
	for (var item of items) {
		if (item.key === selected) {
			item.selected = true;
			break;
		}
	}
	console.log({ menuArgs });
	if (!Array.isArray(items)) return null;
	return <ul>{items.map(MenuItem)}</ul>;
};
