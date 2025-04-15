import State from '../modules/state.js';
import Fragments from '../modules/fragments.js';

const render = (args) => {
	let { itemsProp, selectedProp, template, target } = args;
	const items = State.get(itemsProp) || [];

	const isSelected = (() => {
		if (typeof selectedProp !== 'string') return () => false;
		let [prop, globalProp] = selectedProp.split(' IS ');
		prop = prop.trim();
		globalProp = globalProp.trim();
		const globalValue = State.get(globalProp);
		return (item) => item[prop] === globalValue;
	})();

	if ((target?.id || '').startsWith('for-each-')) {
		target = document.getElementById(target.id);
	}

	if (typeof template === 'string') {
		console.log(template);
		const templateEl = document.getElementById(template);
		if (!templateEl) return;
		const templateContent = templateEl.content.cloneNode(true);
		console.log({ templateEl, templateContent });
		return;
	}

	const children = Array.from(template.children).map((x) =>
		x.cloneNode(true)
	);
	const div = document.createElement('div');
	div.style.width = '100%';
	div.style.height = '100%';

	for (const attrName of template.getAttributeNames()) {
		if (['items', 'selected'].includes(attrName)) continue;
		div.setAttribute(attrName, template.getAttribute(attrName));
	}

	div.innerHTML = '';
	div.id = 'for-each-' + Math.random().toString().replace('0.', '');

	for (const item of items) {
		const itemSelected = isSelected(item);
		for (const child of children) {
			const childClone = child.cloneNode(true);
			const textContentMatches = [
				...childClone.innerHTML.matchAll(/{{(.*?)}}/g),
			].map((x) => x[1]);

			for (const match of textContentMatches) {
				const reg = new RegExp(`{{${match}}}`);
				childClone.innerHTML = childClone.innerHTML.replace(
					reg,
					item[match]
				);
			}
			//childClone.textContent = childClone.textContent.replace();
			//use item to modify childClone

			if (itemSelected) childClone.classList.add('selected');
			div.append(childClone);
		}
	}
	Fragments.mapDescendants({
		source: div,
	});
	target.replaceWith(div);
	return div;
};

const ForEach = async (node) => {
	const itemsProp = node.getAttribute('items');
	const selectedProp = node.getAttribute('selected');
	const templateProp = node.getAttribute('template');
	const template = typeof templateProp === 'string' ? templateProp : node;
	let target = node;
	const updateHandler = () => {
		target = render({ itemsProp, selectedProp, template, target });
	};
	const listenTo = [itemsProp];
	const [, selectedGlobal] = (selectedProp || '').split(' IS ');
	if (selectedGlobal) {
		listenTo.push(selectedGlobal.trim());
	}
	State.subscribe(listenTo, updateHandler);
	updateHandler();
};

export default ForEach;
