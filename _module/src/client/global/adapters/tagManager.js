import { TagManager } from '../components/TagManager';
import { useData } from '../hooks/useData.js';
import { useOptions } from '../hooks/useOptions.js';
import { useState } from 'react';

export const TagManagerAdapter = ({ id: name, props = {}, ...rest }) => {
	const { targetQuery, useData: useDataKey } = props;
	const tags = useOptions({ targetQuery });

	const [selectedTags, setSelectedTags] = useState([]);
	const [search, setSearch] = useState('');

	const parsedName = name?.split('.').slice(-1)[0];

	const finalValue = selectedTags;
	const finalSetter = setSelectedTags;

	const handleChange = (data = []) => finalSetter(data);

	useData(useDataKey ? { key: useDataKey, data: finalValue } : {});

	return {
		Component: TagManager,
		...props,
		...rest,
		tags,
		selectedTags: finalValue,
		setSelectedTags: finalSetter,
		search,
		setSearch,
		handleChange,

		name: parsedName,
	};
};

export const tagManagerAdapter = TagManagerAdapter;
