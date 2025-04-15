import { fillPropsWithTokens } from '../../../utils/parseProperties';

export const getPath = (nameProp, dataSources) => {
	const dataSourcesNames = Object.keys(dataSources);

	const prop = { nameProp };

	const filled = fillPropsWithTokens(prop, dataSources, dataSourcesNames);

	return filled.nameProp.replace('global_', '');
};

export const getParentPath = (path) => {
	return path.split(/[\.\[]/).shift();
};
