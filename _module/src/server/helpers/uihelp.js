const JXON = require('jxon');
const xmlFormat = require('xml-formatter');
const TraverseLib = require('traverse');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const { WithModdedConsole } = require('./consoleHelp');
const colors = require('./colors');

function traverse(o, fn) {
	for (const [k, v] of Object.entries(o)) {
		fn([k, v], o);
		if (!!v && typeof v === 'object') {
			traverse(v, fn);
		}
	}
}
const autoLabelBlacklist = ['Card', 'Stack'];

function xmlTreeReducer(acc = []) {
	const [list = [], order = 0] = acc;

	const ignore = [
		!this.parent,
		this?.key?.startsWith('$'),
		this?.key?.startsWith('_'),
		Array.isArray(this?.node),
	].some((x) => x);

	if (ignore) return acc;

	const isChildOfArray = Number.isInteger(Number(this.key));
	const type = isChildOfArray ? this.parent.key : this.key;

	// calculate parent and key; format like "parent.child.grand"
	let parent = '';
	for (const ancestor of this.parents || []) {
		if (ancestor.node.$key) {
			parent = ancestor.node.$key;
			continue;
		}
		parent = [parent, ancestor.key].filter((x) => x).join('.');
	}

	const key = this.node.$key || [parent, this.key].filter((x) => x).join('.');
	if (isChildOfArray) {
		parent = parent.split('.').slice(0, -1).join('.');
	}

	// get and format properties; format like "prop: value, prop2: value2"
	const specialProps = [
		'$label',
		'$key',
		'$order',
		'$target',
		'$value',
		'$default',
	];
	const purifyForProps = (text) => {
		if (text === '') return '\\blank';
		const trimLines = true;
		const lines = text
			.replace(/\:/g, '\\:')
			.replace(/,/g, '\\,')
			.split('\n');
		const trimCount = lines.reduce((a, o) => {
			const whiteSpace = o.search(/\S/);
			if (whiteSpace <= 0) return a;
			if (a > 0 && whiteSpace < a) return whiteSpace;
			if (a === 0 && whiteSpace > a) return whiteSpace;
			return a;
		}, 0);
		return lines
			.map((x) => (x.search(/\S/) >= trimCount ? x.slice(trimCount) : x))
			.join('\\n');
	};
	const properties = [
		this.node._
			? `textContent: ${purifyForProps(this.node._, this.node)}`
			: '',
		...Object.keys(this.node)
			.filter((x) => x.startsWith('$') && !specialProps.includes(x))
			.map(
				(x) =>
					`${x
						.replace(/^\$/, '')
						.replace(':', 'ESCAPED_COLON')}:${purifyForProps(
						this.node[x],
					)}`,
			),
	]
		.filter((x) => x)
		.join(', ');

	list.push({
		parent,
		key,
		label: this.node.$label || '',
		type,
		target: this.node.$target || '',
		default: this.node.$default || '',
		value: this.node.$value || '',
		order: Number(this.node.$order || order),
		properties,
	});

	return [list, order + 1];
}

function xmlAutoOrder(x) {
	if (this.circular) return;
	if (!Number.isInteger(Number(this.key))) return;
	const orderAttr = this?.node[':@']?.['@_order'];
	if (typeof orderAttr !== 'undefined') return;

	/*
		NOTE: this kind of ordering can fail when:
		- any parent has more than 100 direct children
	*/
	const order = this.path.reverse().reduce((a, o, i) => {
		const index = Number(o);
		if (!Number.isInteger(index)) return a;
		return a + (index + 1) * Math.pow(10, i);
	}, 0);
	const attrUpdates = {
		...this.node[':@'],
		'@_order': order,
	};
	this.update({
		...this.node,
		':@': attrUpdates,
	});
}

const jsonFromXML = WithModdedConsole((input) => {
	const parseOptions = {
		ignoreAttributes: false,
		preserveOrder: true,
		//parseAttributeValue: true,
		allowBooleanAttributes: true,
		stopNodes: ['*.CodeBlock', '*.Markdown'],
	};
	const parser = new XMLParser(parseOptions);
	const jObj = parser.parse(input);
	TraverseLib(jObj).forEach(xmlAutoOrder);

	const buildOptions = {
		ignoreAttributes: false,
		format: true,
		preserveOrder: true,
	};
	const builder = new XMLBuilder(buildOptions);
	const xmlContent = builder.build(jObj);
	//console.log(xmlContent);

	const jx = JXON.stringToXml(xmlContent);
	const tree = JXON.xmlToJs(
		jx,
		3 /*verbosity default: 1, will fail less than 2 */,
		undefined /*freeze*/,
		undefined /*nestedAttributes*/,
	);
	const [_nodes] = TraverseLib(tree).reduce(xmlTreeReducer, [[], 1]);
	const sortAlphabetic = function (a, b) {
		if (a + '' < b + '') return -1;
		if (a + '' > b + '') return 1;
		return 0;
	};
	const sortedByOrder = _nodes.sort((a, b) =>
		sortAlphabetic(a.order, b.order),
	);

	return sortedByOrder;
});

const xmlFromJson = (config) => {
	const tree = {};
	for (const el of config) {
		const { parent, key, type, label, order, properties } = el;
		let head = tree;
		for (const path of parent.split('.')) {
			head[path] = head[path] || {};
			head = head[path];
		}
		head = tree;
		const keyPath = key.split('.').filter((x) => x);
		for (const [k, v] of Object.entries(keyPath)) {
			head[v] = head[v] || {};
			if (Number(k) < keyPath.length - 1) {
				head = head[v];
				continue;
			}
			const $key = key.split('.').pop();
			head[v] = {
				...head[v],
				$key,
				$type: type,
				$order: order,
			};
			if (properties && properties?.length) {
				const props = properties
					.split(',')
					.filter((x) => x)
					.map((x) => x.split(':'));
				for (const [pk, pv = ''] of props) {
					if (!pk) continue;
					head[v]['$' + pk.trim()] = pv.trim();
				}
			}
			//properties && (head[v].$properties = properties);
			label && (head[v].$label = label);
			head = head[v];
		}
	}
	traverse(tree, ([childName, childValue], parent) => {
		if (!childValue?.$type) return [childName, childValue];
		if (parent[childValue.$type]) {
			parent[childValue.$type] = Array.isArray(parent[childValue.$type])
				? parent[childValue.$type]
				: [parent[childValue.$type]];
			parent[childValue.$type].push(childValue);
		} else {
			parent[childValue.$type] = childValue;
		}
		delete parent[childName];
		delete childValue.$type;
	});
	const jx = JXON.jsToXml(tree);
	return xmlFormat(JXON.xmlToString(jx));
};

module.exports = {
	jsonFromXML,
	xmlFromJson,
	getJson: (path) => {
		try {
			const xml = require('fs').readFileSync(path, {
				encoding: 'utf8',
			});
			return jsonFromXML(xml);
		} catch (e) {
			const name = path.split('/mocks/').pop().trim();
			const message = `${name}\: \n\nERROR: ${e.message}\n`;
			console.log(colors.red(message));
			const ISLOCAL = process.env.ISLOCAL;
			if (ISLOCAL !== 'true') return;

			return [
				{
					key: 'Page',
					type: 'Page',
				},
				{
					key: 'Page.Alert',
					parent: 'Page',
					type: 'Alert',
					properties: `textContent: ${message}, severity:error`,
				},
			];
		}
	},
	getXml: (path) => {
		try {
			const json = require(path);
			return xmlFromJson(json);
		} catch (e) {
			console.error(e);
		}
	},
};
