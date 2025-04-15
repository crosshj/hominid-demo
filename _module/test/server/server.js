console.time('load module');
//const server = require('../../src/server/server');
//const server = require('../../dist/server');
const server = require('@awoss/web/server');
console.timeEnd('load module');

const path = require('path');

const graphqlConfig = {
	fragments: path.resolve(__dirname, '../fragments'),
	integrations: path.resolve(__dirname, '../integrations'),
	mocks: path.resolve(__dirname, '../mocks'),
	cors: {
		allowed: [
			'http://localhost:3000',
			'https://greenfield-dev.vercel.app',
			'https://greenfield-uat.vercel.app',
			'https://greenfield-beta.vercel.app',
			'https://greenfield-web.vercel.app',
		],
	},
};
module.exports.query = server.getQueryHandler(graphqlConfig);
module.exports.agent = () => console.log('TODO:agent.messageConsumer');
module.exports.pdf = () => console.log('TODO:pdf.handler');
