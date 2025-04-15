import _ from 'lodash';
import { clone } from '../../../utils';
import { getTokenizableProps } from '../../../utils/parseProperties';

const buildStatefulProp = (key, tokenizableProps, propsIntact) => {
	const tokens = [];
	const pathsToListen = [];

	for (const tokenizableVar of tokenizableProps) {
		const { source, path } = tokenizableVar;

		tokens.push(tokenizableVar);

		if (source === 'row') {
			const { __rowIndex, __rowStateKey } = propsIntact;
			const rowPath = `${__rowStateKey}[${__rowIndex}].${path}`;

			pathsToListen.push(rowPath);
			continue;
		}

		if (source === 'global') {
			pathsToListen.push(path);
			continue;
		}

		if (source === 'theme') {
			// no need to listen to theme, it comes from useTheme
			continue;
		}

		if (['MUI', 'runFlow'].includes(source)) return undefined;

		console.warn(`Unknown data source ${source}.`, { propsIntact });
		return undefined;
	}

	return {
		tokens,
		pathsToListen,
		originalValue: propsIntact[key],
	};
};

/**
 *
 * @param {*} props
 * @returns props with "own props" like `row_index` replaced given `__rowIndex` is provided, for example,
 */
const withOwnFilled = (props) => {
	const _props = clone(props);
	const ownProps = [['row_index', '__rowIndex']];
	for (const [useName, ownName] of ownProps) {
		if (typeof _props[ownName] === 'undefined') continue;
		for (const [k, v] of Object.entries(_props)) {
			if (!v?.includes || !v.includes(useName)) continue;
			_props[k] = v.replace(new RegExp(useName, 'g'), _props[ownName]);
		}
	}
	return _props;
};

/**
 *
 * @param {*} propsIntact
 * @returns {{
 * 	[key: string]: {
 * 			tokens: {}[],
 * 			originalValue?: string,
 * 			pathsToListen: string[]
 * 	}
 * }}
 */
export const getStatefulProps = (propsIntact, fillOwn) => {
	const tokenizableProps = getTokenizableProps(
		fillOwn ? withOwnFilled(propsIntact) : propsIntact,
		true,
	);
	const tokenizablePropsByKey = _.groupBy(tokenizableProps, 'key');

	const statefulPropsDict = {};

	_.forEach(tokenizablePropsByKey, (tokenizableProps, key) => {
		const statefulProp = buildStatefulProp(
			key,
			tokenizableProps,
			propsIntact,
		);

		if (!statefulProp) {
			return;
		}

		_.set(statefulPropsDict, key, statefulProp);
	});

	return statefulPropsDict;
};
