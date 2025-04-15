import * as traverse from 'traverse';
const Traverse = traverse.default || traverse;

const isInteger = (num) => !!num.match(/^-?\d+$/);

export const ObjectFromIdTree = (idTree, rootElName) => {
	let output = {};
	let rootPath = [];
	const outputTranverser = Traverse(output);
	const nodes = Traverse(idTree).nodes();

	for (const node of nodes) {
		if (typeof node !== 'object' || !node.id) continue;

		const name = node.id.split('.').pop();
		const parentPath = node.id.split('.').slice(0, -1);
		rootPath = name === rootElName ? parentPath : rootPath;

		const parent = outputTranverser.get(parentPath);
		const value = Object.entries(node.props || {}).reduce((a, [k, v]) => {
			return { ...a, [k]: v };
		}, {});
		const newParentValue = isInteger(name)
			? [...(parent || []), value]
			: { ...parent, [name]: value };

		outputTranverser.set(parentPath, newParentValue);
	}
	const rootElement = outputTranverser.get([...rootPath, rootElName]);
	output = rootElement || output;
	return output;
};
