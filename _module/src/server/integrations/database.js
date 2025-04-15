const sql = require('mssql');
const COLOR = require('../helpers/colors');
const isLocal = Boolean(process.env.ISLOCAL);
let pool;

const config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	server: process.env.DB_URL,
	//port: 1433, //default
	database: process.env.DB_NAME,
	requestTimeout: 10000,
	connectionTimeout: 10000,
	parseJSON: true,
	options: {
		encrypt: true,
		trustServerCertificate: isLocal, // change to true for local dev / self-signed certs
	},
};

const queryLog = (q) =>
	console.info(
		COLOR.purple('DB QUERY : ') +
			`${q.replace(/^\t/gm, '').replace(/\t/gm, '  ').trim()}`,
	);

const errorLog = (error) =>
	console.info(COLOR.red('DB ERROR : ') + error.message + '\n');

const readDB = async (x) => {
	// @Harrison @Anna - when passing json values, we may need to warn/guard about system limits
	const query = x.query ? x.query : x;
	const map = x.map || ((x) => x);

	queryLog(query);

	let results;
	try {
		pool = pool || (await sql.connect(config));
		results = await pool.request().query(query);
	} catch (e) {
		errorLog(e);
		throw new Error('Database: Failed to execute query.');
	}
	try {
		//console.info(JSON.stringify(results, null, 2));
		const multiResults =
			Array.isArray(results?.recordsets) && results.recordsets.length > 1;
		if (multiResults) {
			return map(results.recordsets);
		}
		return map(results.recordset);
	} catch (e) {
		errorLog(e);
		throw new Error('Database: Failed to parse results.');
	}
};

const close = () => {
	if (isLocal) return;
	try {
		pool = undefined;
		sql.close();
	} catch (e) {
		console.error(e);
	}
};

const execDB = (proc, args, map) =>
	readDB({
		map,
		query:
			`EXEC ${proc} ` +
			Object.entries(args)
				.map(([k, v]) => {
					if ((v + '').toLowerCase() === 'null') return `@${k}=NULL`;
					return `@${k}='${v}'`;
				})
				.join(', '),
	});

module.exports = { readDB, execDB, close };
