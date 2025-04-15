const FormResult = (formIndex) => (dbResult) => {
	if (dbResult.ControlType === 'Form') {
		let {
			FormKey: key,
			FormLabel: label,
			HeaderDynamicValue: dynamic = '',
			spNameCUD: target,
			properties = '',
		} = dbResult;

		if (key === 'prospectCreate') {
			properties = [
				...properties.split(',').filter((x) => x),
				'targetRedirect:root.clients',
			].join(', ');
		}
		return {
			type: 'Form',
			key,
			label: label + dynamic,
			target,
			properties,
		};
	}
	if (dbResult.type === 'Section') return dbResult;

	let {
		FormKey: parent,
		FormElementKey: key,
		ControlType: type,
		LabelText: label,
		DefaultValue: defaultValue,
		Properties: properties,
		FormSectionID: sectionId = '',
		TabOrder: order,
		InputValue: value,
	} = dbResult;

	order = order || 0;
	if (sectionId || sectionId === 0) {
		parent = parent + '.' + formIndex + '.section.' + sectionId;
	} else {
		parent = parent + '.' + formIndex;
	}

	return {
		key,
		label,
		order,
		value,
		default: defaultValue,
		type,
		parent,
		properties,
	};
};

const FormSections = (dbResults, i) => {
	const sections = [];
	for (var element of dbResults) {
		if (element.type === 'Form') continue;
		if (!element.FormSectionID && element.FormSectionID !== 0) continue;
		const key =
			element.FormKey + '.' + i + '.section.' + element.FormSectionID;
		const found = sections.find((x) => x.key === key);
		if (found && found.SectionOrder < element.SectionOrder) {
			found.order = element.SectionOrder;
			continue;
		} else if (found) {
			continue;
		}
		sections.push({
			type: 'Section',
			key,
			parent: element.FormKey + '.' + i,
			order: element.SectionOrder,
			label: element.FormSectionLabel,
		});
	}
	return sections;
};

const FormTransform = (dbResults, queryArgs) => {
	let [FormDef, FormElements = [], FormData = []] = dbResults;
	FormDef = FormDef?.[0] || {};

	const mapFormData = (fd = {}, i = 0) => {
		const elementsMap = (x) => {
			x.InputValue = fd[x.FormElementKey];
			return x;
		};
		return [
			{
				ControlType: 'Form',
				...FormDef,
				FormKey: FormDef.FormKey + '.' + i,
			},
			...FormSections(FormElements, i),
			...FormElements.map(elementsMap),
		].map(FormResult(i));
	};

	const mapped = mapFormData(FormData?.[0]);
	return mapped;
};

module.exports = { FormTransform };
