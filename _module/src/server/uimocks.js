const getFiles = require('./utils/getFiles');
const uiHelper = require('./helpers/uihelp');

const userMap = {
	'atworkrole+parent@gmail.com': 'Parent',
	'atworkrole+child@gmail.com': 'Child',
	'atworkrole+client@gmail.com': 'Client',
	'atworkrole+talent@gmail.com': 'Talent',
	1: 'SiteAdmin',
	2: 'Parent',
	3: 'BranchAdmin',
	4: 'RegionAdmin',
	5: 'Child',
	7: 'Talent',
	8: 'Client',
};

const getKey = ({ args, query, session }) => {
	let _key = args?.fragment || args?.key;

	if (args?.ListViewName) {
		_key = args.ListViewName;
	}
	if (args?.OptionListName) {
		_key = args.OptionListName;
	}

	const shouldMapKey =
		_key?.split &&
		['root', 'staff', 'features', 'applications'].includes(
			_key.split('.').pop(),
		);

	if (!shouldMapKey) return _key;
	const role = userMap[session?.roleId] || userMap[session?.role];
	if (!role) return _key;
	return _key + role;
};

const getjsMockResult = async ({ jsMockDir, args, query, session }) => {
	try {
		const key = getKey({ args, query, session });
		if (!key) return;

		const allMocks = (await getFiles(jsMockDir))
			.filter((x) => x.endsWith('.js') || x.endsWith('.json'))
			.reduce((a, o) => {
				const key = o
					.split(jsMockDir)
					.pop()
					.split('/')
					.join('')
					.replace(/\.(js|json)$/, '')
					.toLowerCase();
				return { ...a, [key]: o };
			}, {});

		const found =
			allMocks[key?.toLowerCase()] ||
			allMocks[key?.toLowerCase().split('.').pop()];
		if (!found) return;

		const jsMockFound = require(found);
		if (!jsMockFound) return;

		const mockIsFn = typeof jsMockFound === 'function';
		if (!mockIsFn)
			return {
				name: key,
				results: jsMockFound,
			};

		const results = jsMockFound(args, query, session);
		if (!results) return;

		return {
			name: found.split(jsMockDir).pop().trim(),
			results,
		};
	} catch (e) {
		console.error(e);
	}
};

const getXMLMockResult = async ({ xmlMockDir, args, query, session }) => {
	try {
		const key = getKey({ args, query, session });
		if (!key) return;

		const xmlMocks = (await getFiles(xmlMockDir))
			.filter((x) => x.endsWith('.xml'))
			.reduce((a, o) => {
				const key = o
					.split(xmlMockDir)
					.pop()
					.split('/')
					.join('')
					.replace(/.xml$/, '')
					.toLowerCase();
				return { ...a, [key]: o.split(xmlMockDir).pop() };
			}, {});

		const found =
			xmlMocks[key?.toLowerCase()] ||
			xmlMocks[key?.toLowerCase().split('.').pop()];
		if (!found) return;
		const results = uiHelper.getJson(xmlMockDir + found);
		if (!results) return;

		return {
			name: found.split(xmlMockDir).pop().trim(),
			results,
		};
	} catch (e) {
		console.error(e);
	}
};

module.exports =
	({ fragments, mocks }) =>
	async (args, query, session) => {
		const jsMockDir = mocks.replaceAll('\\', '/');
		const xmlMockDir = fragments.replaceAll('\\', '/');
		//console.log({ args, query, session, xmlMockDir, jsMockDir });
		const jsMockResult = await getjsMockResult({
			jsMockDir,
			args,
			query,
			session,
		});
		if (jsMockResult) {
			return jsMockResult;
		}

		const xmlMockResult = await getXMLMockResult({
			xmlMockDir,
			args,
			query,
			session,
		});
		if (xmlMockResult) {
			return xmlMockResult;
		}
	};
