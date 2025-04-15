const doQuery =
	(execQuery) =>
	async (body, headers = {}) => {
		const result = await execQuery({
			headers: { origin: 'http://localhost:3000', ...headers },
			body: JSON.stringify(body),
		});
		const response = JSON.parse(result.body);
		if (response.errors && response.errors.length)
			return { error: response.errors };
		return response;
	};

module.exports = doQuery;
