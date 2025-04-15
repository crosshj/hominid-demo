export const filterMenusByName = (menus, name) => {
	if (!menus || menus.length === 0) return null;

	return menus
		?.filter((menu) => menu.menu_name === name)
		?.sort((a, b) => {
			return a?.item_order - b?.item_order;
		});
};
