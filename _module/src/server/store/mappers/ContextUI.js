//const prospectCreateUI = require('../kludge/prospectCreateUI');

const ContextResult = (dbResult) => {
	const {
		ComponentKey: key = '',
		LabelText: label = '',
		OrderBy: order = '',
		CompType: type = '',
		Properties: properties = '',
		value = '',
		parent = '',
	} = dbResult;

	return {
		key,
		label,
		order,
		value,
		type,
		parent: parent || key.split('.').slice(0, -1).join('.'),
		properties,
	};
};
const ContextTransform = (dbResults, queryArgs) => {
	//const KLUDGE = prospectCreateUI(dbResults, queryArgs);
	//return (KLUDGE || dbResults).map(ContextResult);
	return dbResults.map(ContextResult);
};

exports.ContextTransform = ContextTransform;
