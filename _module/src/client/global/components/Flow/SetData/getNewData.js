import { paramsFromPath } from '../../../utils/params';
import { getFirstValidValue } from './getFirstValidValue';
import { mutateValue } from './mutateValue';
import { handleDateKeywords, isDateKeyword } from '../../../utils/dateKeywords';
import { ApplyStringFormatters } from '../../../utils/parseProperties';

export const getNewData = (
	{ mutate, route, data },
	dataSources,
	currentValue,
	debug,
) => {
	if (route) {
		return paramsFromPath({ route, debug });
	}

	if ([false, ''].includes(data)) {
		return data;
	}

	if (mutate) {
		return mutateValue(currentValue, mutate);
	}

	if (data && isDateKeyword(data)) {
		const [keyword, maybeFormatter] = String(data).split(':');

		const result = handleDateKeywords(data);

		const formattedResult = ApplyStringFormatters(result, maybeFormatter, {
			debug,
		});

		return formattedResult;
	}

	if (typeof data !== 'undefined') {
		return getFirstValidValue(data, dataSources, { debug });
	}

	return undefined;
};
