import _ from 'lodash';
import {
	ApplyStringFormatters,
	fillPropsWithTokens,
} from '../../../utils/parseProperties';

export const getFirstValidValue = (data, dataSources, { debug = false }) => {
	if (!_.isString(data)) return data;

	const dataPaths = data.split(',').map((x) => x.trim().split(':'));

	const sourcesNames = Object.keys(dataSources);

	const getFromStatic = (dataPath, formatter) => {
		const isStaticNull = dataPath === 'static_null';
		const value = isStaticNull ? null : dataPath.replace('static_', '');

		return ApplyStringFormatters(value, formatter, { debug });
	};
	for (const [dataPath, formatter] of dataPaths) {
		if (dataPath.startsWith('static_')) {
			return getFromStatic(dataPath, formatter);
		}

		const { dataFilled } = fillPropsWithTokens(
			{ dataFilled: dataPath },
			dataSources,
			sourcesNames,
		);

		// TODO: why can't we just use a formatter if formatter is specified and valid?
		// if(typeof formatter !== 'undefined'){
		//     return ApplyStringFormatters(dataFilled, formatter, { debug });
		// }

		if (dataFilled === 'null') {
			return null;
		}
		if (
			_.isString(dataFilled) &&
			!_.isEmpty(dataFilled) &&
			!Number.isNaN(Number(dataFilled)) &&
			typeof formatter === 'undefined'
		) {
			return Number(dataFilled);
		}
		if (_.isObject(dataFilled)) {
			return ApplyStringFormatters(dataFilled, formatter, { debug });
		}

		if (
			_.isString(dataFilled) &&
			dataFilled !== 'undefined' &&
			!dataFilled.includes('global_')
		) {
			return ApplyStringFormatters(dataFilled, formatter, { debug });
		}
	}
	return undefined;
};
