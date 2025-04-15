const quoteWrap = (x) => {
	return typeof x === 'undefined' ? `''` : `'${x}'`;
};
const SQLDate = (x) => {
	try {
		return quoteWrap(
			new Date(x).toISOString().slice(0, 19).replace('T', ' ')
		);
	} catch (e) {}
	return '';
};
const fromSQLDate = (x = '') => {
	if (!x) return '';
	if (x instanceof Date) return x.toISOString();
	try {
		return (x || '').includes('Z')
			? new Date(x).toISOString()
			: new Date(x + 'Z').toISOString();
	} catch (e) {
		console.error(e);
		return 'DATE_ERROR';
	}
};
const whereClause = (params = {}) => {
	if (!Object.keys(params).length) return '';

	const paramString = Object.entries(params)
		.filter(([k, v]) => v !== '')
		.filter(([k, v]) => v !== undefined)
		.map(([k, v]) => `${k} = '${v}'`)
		.join(' AND ')
		.trim();
	if (!paramString.length) return '';
	return 'WHERE ' + paramString;
};

const insertQuery = (tableName, record) =>
	`
INSERT INTO ${tableName}
( ${Object.entries(record)
		.map(([k, v]) => k)
		.join(',')} )
VALUES
( ${Object.entries(record)
		.map(([k, v]) => v)
		.join(',')} );
`.trim();

module.exports = { quoteWrap, SQLDate, fromSQLDate, whereClause, insertQuery };
