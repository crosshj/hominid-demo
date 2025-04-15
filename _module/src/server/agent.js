const { getLoggerWithPath } = require('./utils/logging');
const SQS = require('./integrations/sqs');
const Logger = getLoggerWithPath(__filename);

const ISLOCAL = process.env.ISLOCAL;
// const MINUTE_IN_MS = 60000;
// const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const { paybillTaxes } = require('../integrations/payroll/paybillTaxes');
const {
	paybillCreateGarnishments,
} = require('../integrations/payroll/paybillCreateGarnishments');
const {
	paybillCreateInvoices,
} = require('../integrations/payroll/paybillCreateInvoices');
const {
	paybillCreatePayChecks,
} = require('../integrations/payroll/paybillCreatePayChecks');

const allFns = {
	paybillCreatePayChecks,
	paybillCreateGarnishments,
	paybillTaxes,
	paybillCreateInvoices,
};
const messageConsumer = async (event) => {
	const { Records = [] } = event;
	for (const { body } of Records) {
		try {
			Logger.log(`Try to parse: ${body}`);
			const { function: functionName, args } = JSON.parse(body);

			Logger.log(
				`Try to run ${functionName} typeof ${typeof allFns[
					functionName
				]} with args ${JSON.stringify(args)}`,
			);
			await allFns[functionName](args);
		} catch (e) {
			Logger.log(e);
		}
	}
};

// wraps functions so they run both locally and in the cloud (lambda)
const MessageOrRun = (fn, name = '') => {
	return (args) => {
		if (!ISLOCAL) {
			return SQS.sendMessage({ function: name, args });
		}
		return fn(args);
	};
};

const getProcessHandler = (process) => {
	const handler = allFns[process];

	if (!handler) {
		console.error(
			`${process} does not have a handler. Make sure to set up in agent.js`,
		);
		return () => {};
	}

	return MessageOrRun(handler, process);
};

module.exports = {
	messageConsumer,
	getProcessHandler,
};
