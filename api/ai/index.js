const { system, user } = require('./_prompts');
const { OPENAI_KEY } = process.env;
const menuDefault = require('../../mocks/ai/menuDefault');

const defaultMenus = {
	status: 200,
	data: {
		Data: [
			{
				cacheExpires: null,
				name: 'ui.sp_GetData',
				uuid: '8a4e473e-a953-49ca-a797-7224a39bc91e',
				results: menuDefault(),
			},
		],
	},
};

const getPayload = async (req) => {
	const body = {
		seed: 1,
		temperature: 0,
		messages: [
			{ role: 'system', content: system(req.body) },
			{ role: 'user', content: user(req.body) },
		],
		model: 'gpt-3.5-turbo-1106',
		//model: 'gpt-4-1106-preview',
		response_format: { type: 'json_object' },
	};
	return JSON.stringify(body);
};
const getOpenAIResponse = async (req) => {
	const { openai_token } = req.body;
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${openai_token || OPENAI_KEY}`,
	};
	const body = await getPayload(req);
	const completion = await fetch(
		'https://api.openai.com/v1/chat/completions',
		{ headers, method: 'POST', body }
	).then((x) => x.json());
	//console.log(JSON.stringify({ completion }, null, 2));
	const { message, finish_reason } = completion?.choices?.[0];
	if (finish_reason !== 'stop') {
		return { error: 'something went wrong' };
	}
	try {
		const { components } = JSON.parse(message?.content);
		return {
			data: {
				Data: [
					{
						cacheExpires: null,
						name: 'ui.sp_GetData',
						uuid: '8a4e473e-a953-49ca-a797-7224a39bc91e',
						results: JSON.stringify(components),
					},
				],
			},
		};
	} catch (e) {
		return { error: 'something went wrong' };
	}
};
module.exports = async (req, res) => {
	if (!OPENAI_KEY) return res.send(defaultMenus);
	const message = await getOpenAIResponse(req);
	res.send({
		status: 200,
		...message,
	});
};
