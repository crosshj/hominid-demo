export const searchRows =
	({ columns, search, searchRowKey }) =>
	(row) =>
		row?.filter((column, index) => {
			if (typeof column !== 'string') return false;
			if (typeof search !== 'string') return true;
			const colMatchesSearch = column
				.toLowerCase()
				.includes(search.toLowerCase());
			const colMatchesSRK = searchRowKey
				? columns[index].key === searchRowKey
				: true;
			return colMatchesSearch && colMatchesSRK;
		}).length;
