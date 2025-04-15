import { getComparator } from './getComparator';
import { stableSort } from './stableSort';

export const sortRows = ({ rows, order, orderBy, columns }) => {
	if (!rows) return [];
	return stableSort(rows, getComparator({ order, orderBy, columns }));
};
