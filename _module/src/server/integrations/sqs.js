const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { getLoggerWithPath } = require('../utils/logging');

const sqsClient = process.env.ISLOCAL ? undefined : new SQSClient();

const Logger = getLoggerWithPath(__filename);

const sendMessage = async (args) => {
	if (!sqsClient) return;

	const msgCmdConfig = {
		QueueUrl: process.env.QUEUE_URL,
		MessageBody: JSON.stringify(args),
	};

	Logger.log('sending message to agentWorker');
	Logger.log({ msgCmdConfig });

	const result = await sqsClient.send(new SendMessageCommand(msgCmdConfig));
	return result;
};

const SQS = {
	sendMessage,
};

module.exports = SQS;
exports.sendMessage = sendMessage;
