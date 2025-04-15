const { readDB: databaseExec } = require('../integrations/database');
const { decryptResults } = require('./mappers/Encryption');
//const { getIntegration } = require('../../integrations');
const COLOR = require('../helpers/colors');
const { getSession } = require('../utils/session');

//TODO: should be reading config and returning integration based on that
const getIntegration = () => {};

module.exports =
	(queryParse, resultsParse) =>
	async ({ input, ctx }) => {
		const { mocks: uiMocks } = ctx;

		let results = [];
		const multiQueryContext = {};
		for (const { name, call, uuid, args = '' } of input) {
			try {
				const queryParser = queryParse[name];
				const resultsParser = resultsParse[name];
				if (!queryParser)
					throw new Error(`unable to parse the query: ${name}`);
				if (!resultsParser)
					throw new Error('unable to parse the database results');

				const queryArgs = JSON.parse(args);

				const session = getSession({ name, queryArgs });
				if (session.error) {
					console.info(COLOR.red('ERROR   : ') + session.error);
					throw new Error('Session: not logged in');
				}

				const query = queryParser(
					queryArgs,
					results,
					multiQueryContext,
					session,
				);
				if (query === undefined)
					throw new Error('failed to build query');

				const anyUIMock = await uiMocks(queryArgs, query, session);
				if (anyUIMock) {
					console.info(COLOR.blue('MOCKED   : ') + anyUIMock.name);
					results.push({
						uuid,
						name,
						key: queryArgs.key,
						results: queryArgs.fragment
							? JSON.stringify(anyUIMock.results)
							: anyUIMock.results,
					});

					continue;
				}

				let integrationResult;
				if (typeof call !== 'undefined') {
					integrationResult = await getIntegration(
						{ ...queryArgs, call },
						query,
						session,
					);
				}
				if (typeof integrationResult !== 'undefined') {
					if (integrationResult.error) {
						results.push({
							name,
							uuid,
							error: integrationResult.error,
						});
					} else {
						results.push({
							name,
							uuid,
							results: integrationResult.results,
						});
					}
					continue;
				}

				const map = resultsParser({ uuid, name }, queryArgs);
				const dbResults = await databaseExec({ query, map });
				results.push(dbResults);
			} catch (e) {
				if (
					e?.message?.startsWith &&
					!['Database:', 'Session:'].some((x) =>
						e.message.startsWith(x),
					)
				) {
					console.error(e);
				}
				results.push({ name, uuid, error: e.message });
			}
		}

		results = decryptResults(results);

		return results;
	};
