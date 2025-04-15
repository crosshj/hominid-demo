import { getChildren } from '../tree';
import { contextParser } from './../../global/utils';
import { parseProperties } from '../../global/utils/parseProperties';

export const formParser = (formDefinition) => {
	try {
		if (!formDefinition || !formDefinition?.length) return null;

		const formItem = formDefinition?.find((i) => i.type === 'Form');
		const fields =
			getChildren(
				formItem,
				contextParser(formDefinition.filter((i) => i.type !== 'Form')),
			) || [];
		const props = parseProperties(formItem.properties);

		return {
			label: formItem?.label || '',
			target: formItem?.target || null,
			icon: props?.icon || null,
			fields,
		};
	} catch (e) {
		return null;
	}
};

export const formTreeBuilder = (context) => {
	if (!context || !context?.length) return [];

	const sections = context.filter((item) => item.type === 'Section');
	const formTree = sections.map((section) => {
		const newSection = section;
		newSection.children = [];
		newSection.children = context.filter(
			(item) => item?.type != 'Section' && item?.parent == section?.key,
		);
		return newSection;
	});
	return formTree;
};
