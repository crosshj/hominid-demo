export const getNesting = (props, args) => {
	const { nestingNames, nesting } = props;
	//DEPRECATE: should use the other pattern instead
	if (args.type === 'DataEditView') {
		const params = (nesting || '').split('&');
		const names = (nestingNames || '').split('&');
		const levels = params.length;
		return { params, names, levels };
	}

	const nestElement = args?.children?.find((x) => x.type === 'Nest');
	const nestDef = {
		params: [],
		levels: 0,
		names: [],
		icons: [],
		attributes: [],
	};
	const nestChildren = nestElement?.children || [];

	//NOTE: this adds a border around children by creating a fake level, otherwise it's white on white
	// Addons have to be placed in this fake level, not on original level
	if (nestChildren.length === 1) {
		nestChildren.push({
			type: 'Level',
			props: {
				param: '*',
				variant: 'no-header',
			},
			children: Array.isArray(nestChildren[0].children)
				? nestChildren[0].children.filter((x) => x.type === 'Addon')
				: undefined,
		});
		if (Array.isArray(nestChildren[0].children)) {
			nestChildren[0].children = nestChildren[0].children.filter(
				(x) => x.type !== 'Addon',
			);
		}
	}
	nestDef.levels = nestChildren.length;

	for (const child of nestChildren) {
		const { param, name, icon, ...rest } = child?.props || {};
		nestDef.attributes.push(rest);
		nestDef.params.push(param);
		nestDef.names.push(name);
		nestDef.icons.push(icon);
	}

	if (nestDef.levels === 0) {
		nestDef.params.push('_not_nested');
	}

	return nestDef;
};

const defaultNesting = [
	{
		param: '*',
		name: '',
	},
];
export const getNestingAlt = ({ children = [] } = {}) => {
	const nestDef = children.find((x) => x.type === 'Nest') || {};
	const { children: nest } = nestDef;
	if (typeof nest === 'undefined') return defaultNesting;
	const nesting = nest.map((x, i) => {
		const levelDef = {
			...x.props,

			children: x.children,
		};
		if (!Array.isArray(x.children)) {
			levelDef.variant = 'no-header';
		}
		return levelDef;
	});
	//console.log({ nestDef, nesting });
	return nesting;
};
