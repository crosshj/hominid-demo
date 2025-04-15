function hashCode(string) {
	var hash = 0;
	for (var i = 0; i < string.length; i++) {
		var code = string.charCodeAt(i);
		hash = (hash << 5) - hash + code;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function createItem(args) {
	const { values, index, name, params, row } = args;
	const param = params[index];
	//const _nestId = 'nest-' + (Math.random() + '').slice(2);
	const withNestId = (obj) => {
		const _nestId = 'nest-' + hashCode(JSON.stringify(obj));
		return { _nestId, ...obj };
	};

	if (Array.isArray(values))
		return withNestId({
			_id: values[index],
			_params: params.map((param) => row[param]),
			_type: params[index],
			name: row[name],
			children: [],
		});
	if (param === '*')
		return withNestId({
			_id: '*',
			name,
			children: [],
		});
	if (param === 'no-header') {
		return withNestId({
			_id: hashCode(JSON.stringify(row)),
			_type: 'no-header',
			name,
			children: [],
		});
	}
	return withNestId({
		_id: row[param],
		_params: params.map((param) => row[param]),
		_type: param,
		name: row[name],
		children: [],
	});
}

const nestDataForTotals = (args) => {
	const params = ['*', 'no-header'];
	const { data = [], names = [''] } = args;

	const results = [];
	for (const row of data) {
		let target = results;
		let current = undefined;
		for (const [index, param] of Object.entries(params)) {
			const name = names[index];
			current = target.find((item) => {
				if (item._id === row[param]) return true;
				if (param === '*' && item._id === param) return true;
				return false;
			});
			if (!current) {
				const created = createItem({ index, name, params, row });
				target.push(created);
				current = created;
			}
			const isLastParam = Number(index) === params.length - 1;
			if (isLastParam) continue;
			target = current.children;
		}
		current.children.push(row);
	}
	return results;
};

export const nestData = (args) => {
	const { params = [''], data = [], names = [''] } = args;
	if (data?.length === 0) return [];

	if (params[0] === '*') return nestDataForTotals(args);
	if (params?.length > 0 && params[0] === '') return data;

	const res = (data || []).reduce((results, row) => {
		const values = params.map((param) => row[param]);

		let target = results;

		values.forEach((value, index) => {
			//checks if the group with the param value already exists. Case not, create it
			let found = target?.find((item) => item._id === value);
			if (!found) {
				const name = names[index];
				const created = createItem({
					index,
					name,
					params,
					row,
					values,
				});
				target.push(created);
				found = target[target.length - 1];
			}

			//case next loop is the last, push the entire row into group's children
			if (index === values.length - 1) {
				found.children.push(row);
			} else {
				target = found.children;
			}
		});
		return results;
	}, []);

	return res;
};
