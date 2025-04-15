import Fragments from '../modules/fragments.js';
import State from '../modules/state.js';

const render = async (args) => {
	let { template, target, path } = args;
	if ((target?.id || '').startsWith('container-')) {
		target = document.getElementById(target.id);
	}
	const div = document.createElement('div');
	div.className = [
		'container',
		'fit-parent',
		...template.className.split(' '),
	].join(' ');
	div.id = 'container-' + Math.random().toString().replace('0.', '');

	if (typeof path !== 'undefined' && path) {
		const fragConfig = {
			path: path + '.xml',
			swap: div,
			debug: false,
		};
		await Fragments.update(fragConfig);
	}
	target.replaceWith(div);
	return div;
};

const Container = async (node) => {
	const pathSrc = node.getAttribute('path');
	const matches = [...pathSrc.matchAll(/{{(.*?)}}/g)].map((x) => x[1]);
	const template = node;
	let target = node;

	const update = async () => {
		let path = pathSrc;
		if (matches && matches.length) {
			for (const match of matches) {
				const reg = new RegExp(`{{${match}}}`);
				path = pathSrc.replace(reg, State.get(match));
			}
		}
		target = await render({ template, target, path });
	};
	if (matches && matches.length) {
		State.subscribe(matches, update);
	}
	await update();
};

export default Container;
