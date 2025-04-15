export function descendingComparator(a, b, orderBy, columns) {
	const column = columns?.findIndex((c) => c.key === orderBy);

	if (column?.numeric) {
		if (Number(b[column]) < Number(a[column])) {
			return -1;
		}
		if (Number(b[column]) > Number(a[column])) {
			return 1;
		}
		return 0;
	}

	if (b[column] < a[column]) {
		return -1;
	}
	if (b[column] > a[column]) {
		return 1;
	}
	return 0;
}
