import { descendingComparator } from './descendingComparator';

export function getComparator({ order, orderBy, columns }) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy, columns)
		: (a, b) => -descendingComparator(a, b, orderBy, columns);
}
