// const buttonColumnsKludge = require('../kludge/buttonColumns');
// const columnTargetKludge = require('../kludge/columnTarget');

const ListItem = (columns) => (dbResult) => {
	return columns.map((colName) => '' + (dbResult[colName] || ''));
};

const Column = (queryArgs) => (colString, order) => {
	const hidden = colString.toLowerCase().includes('.hidden');
	const key = colString.replace(/\.hidden$/i, '');

	//const kludge = columnTargetKludge(queryArgs.key, key);
	return {
		key,
		label: key,
		hidden,
		target: '',
		properties: '',
		order,
		//...kludge,
	};
};

const ListTransform = (dbResults = [], queryArgs) => {
	const columns = Object.keys(dbResults?.[0] || {});
	const mappedResults = {
		columns: columns.map(Column(queryArgs)),
		rows: dbResults.map(ListItem(columns)),
	};
	//buttonColumnsKludge(mappedResults, queryArgs);
	return mappedResults;
};

exports.ListTransform = ListTransform;
