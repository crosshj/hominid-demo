import { defineMock } from 'vite-plugin-mock-dev-server';
import { ctxDashboard } from './graphql/ctxDashboard';
import { menuRoot } from './graphql/menuRoot';
import { ctxFeatures } from './graphql/ctxFeatures';
import { notMocked } from './graphql/notMocked';
import { graphqlGeneric } from './graphql/graphqlGeneric';

export default defineMock({
	url: '/api/graphql',
	method: 'POST',
	response: async (req, res, next) => {
		const { query, body, params, headers } = req;
		//console.log(query, body, params, headers);
		res.setHeader('Content-Type', 'application/json');

		if (typeof query['ctx:dashboard'] !== 'undefined') {
			res.end(ctxDashboard);
			return;
		}
		if (typeof query['ctx:features'] !== 'undefined') {
			res.end(ctxFeatures);
			return;
		}
		if (typeof query['menu:root'] !== 'undefined') {
			res.end(menuRoot);
			return;
		}

		let result;
		try {
			result = await graphqlGeneric(req);
		} catch (e) {}
		if (typeof result !== 'undefined') {
			res.end(result);
			return;
		}

		res.end(notMocked(req));
	},
});
