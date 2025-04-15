export function descendingComparator(a, b, orderBy, columns) {
	const column = columns?.find((c) => c.field === orderBy);

	const { field } = column || {};
	if (!column) return;

	if (column?.numeric) {
		if (Number(b[field]) < Number(a[field])) {
			return -1;
		}
		if (Number(b[field]) > Number(a[field])) {
			return 1;
		}
		return 0;
	}

	if (b[field] < a[field]) {
		return -1;
	}
	if (b[field] > a[field]) {
		return 1;
	}
	return 0;
}
