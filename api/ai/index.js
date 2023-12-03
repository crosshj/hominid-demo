const { system, user } = require('./_prompts');
const { OPENAI_KEY } = process.env;

const defaultMenus = {
	status: 200,
	data: {
		Data: [
			{
				cacheExpires: null,
				name: 'ui.sp_GetData',
				uuid: '8a4e473e-a953-49ca-a797-7224a39bc91e',
				results:
					'[{"key":"Menu.Books","properties":"class:menu-item","label":"Books 😁"},{"key":"Menu.Authors","properties":"class:menu-item","label":"Authors"},{"key":"Menu.Bestsellers","properties":"class:menu-item","label":"Bestsellers"},{"key":"Menu.Fiction","properties":"class:menu-item","label":"Fiction"},{"key":"Menu.NonFiction","properties":"class:menu-item","label":"Non-Fiction"},{"key":"Menu.SciFi","properties":"class:menu-item","label":"Sci-Fi"},{"key":"Menu.Mystery","properties":"class:menu-item","label":"Mystery"},{"key":"Menu.History","properties":"class:menu-item","label":"History"},{"key":"Menu.Childrens","properties":"class:menu-item","label":"Children\'s"},{"key":"Menu.Thriller","properties":"class:menu-item","label":"Thriller"}]',
			},
		],
	},
};

const getPayload = async (req) => {
	const body = {
		seed: 1,
		temperature: 0,
		messages: [
			{ role: 'system', content: system() },
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
