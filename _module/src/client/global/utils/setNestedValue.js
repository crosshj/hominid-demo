import _ from 'lodash';
export const setNestedValue = (obj, path, value) => {
	return _.set(obj, path, value);
};
