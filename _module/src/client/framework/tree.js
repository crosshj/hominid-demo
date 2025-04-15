import { orderContextItems } from '../global/utils';

export const getChildren = (el, UIContext) => {
	if (!UIContext) return null;
	return UIContext?.filter((item) => item.parent === el?.key)
		?.map((child) => {
			const children = getChildren(child, UIContext)?.sort(
				orderContextItems,
			);
			return children.length > 0 ? { ...child, children } : child;
		})
		.sort(orderContextItems);
};

export const treeBuilder = (UIContext) => {
	const tree = {};
	tree.children = getChildren(tree, UIContext);
	return tree;
};
