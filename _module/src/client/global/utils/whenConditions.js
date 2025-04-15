import _, { cond } from 'lodash';
import { cookieOperations } from './cookies';
import { StateManager } from '../../state/state';

const cleanValue = (x) => x.replaceAll('"', '');

const ROLE_FUNCTIONS = {
	HASROLES: (allUserRoles, expectedRoles) => {
		return allUserRoles.some((role) => expectedRoles.includes(role.key));
	},
	HASBRANCHROLES: (allUserRoles, expectedRoles) => {
		const currentBranchId = cookieOperations.get('CURRENTBRANCH');
		const onlyBranchRoles = allUserRoles.filter(
			(role) => Number(role.branchId) === Number(currentBranchId),
		);

		return onlyBranchRoles.some((role) => expectedRoles.includes(role.key));
	},
	ISPARENTATBRANCH: (allUserRoles, expectedRoles) => {
		const currentBranchId = cookieOperations.get('CURRENTBRANCH');
		const onlyBranchRoles = allUserRoles.filter(
			(role) => Number(role.branchId) === Number(currentBranchId),
		);

		return onlyBranchRoles.some((role) => role.isParent);
	},
};

const NUMBER_COMPARATORS = {
	GREATERTHAN: 'GREATERTHAN',
	GREATEROREQUALTHAN: 'GREATEROREQUALTHAN',
	LESSTHAN: 'LESSTHAN',
	LESSOREQUALTHAN: 'LESSOREQUALTHAN',
};

export function whenParser(conditionSrc = '', logger) {
	// The following regex will identify a UPPERCASE name followed by a lowercase value
	const regexParser = /([A-Z][a-zA-Z]*)\s+((?:"[^"]*")|(?:'[^']*')|\S+)/g;

	const condition = conditionSrc
		.replace(/debug/i, '')
		.replaceAll('IS NOT', 'ISNOT')
		.replaceAll("'", '"')
		.trim();

	const parsed = {
		conditions: [],
		joiner: undefined,
		then: true,
		else: false,
		debug: conditionSrc.toUpperCase().startsWith('DEBUG'),
	};

	const terms = Array.from(condition.matchAll(regexParser));

	for (let i = 0; i < terms.length; i++) {
		const [, key, value] = terms[i] || [];
		const [, previousKey, previousValue] = terms[i - 1] || [];
		let [, nextKey, nextValue] = terms[i + 1] || [];

		let numberToCompareWith;
		const isNumberComparator = Object.keys(NUMBER_COMPARATORS).some(
			(x) =>
				typeof nextValue === 'string' &&
				nextValue.toLowerCase().startsWith(x.toLowerCase()),
		);

		if (isNumberComparator) {
			const [numberComparator, almostNumberToCompareWith] =
				nextValue.split('(');

			numberToCompareWith = almostNumberToCompareWith.split(')')[0];
			nextValue = numberComparator.toUpperCase();
		}

		// normally the last iteration
		if (key === 'THEN') {
			parsed.then = cleanValue(value);
			parsed.else =
				nextKey === 'ELSE' ? cleanValue(nextValue) : undefined;

			break;
		}

		// using only ELSE, without IS or THEN
		if (i + 1 === terms.length && key === 'ELSE') {
			parsed.else = cleanValue(value);
			break;
		}

		// store joiner
		if (['OR', 'AND'].includes(key)) {
			// joiner was already stored and current joiner is different than existing one
			if (parsed.joiner !== undefined && key !== parsed.joiner) {
				logger(
					'whenParser: using AND/OR altogether. We do not support mixed AND/OR',
				);
				parsed.conditions = [];
				return parsed;
			}

			parsed.joiner = key;
		}

		// skip odd iterations because we start storing at index 0 and keep storing at even indexes
		if (i % 2 === 1) continue;

		parsed.conditions.push({
			when: value,
			...(nextKey === 'IS'
				? { is: cleanValue(nextValue), isSrc: cleanValue(nextValue) }
				: {}),
			...(nextKey === 'ISNOT'
				? {
						isnot: cleanValue(nextValue),
						isnotSrc: cleanValue(nextValue),
				  }
				: {}),
			...(isNumberComparator ? { numberToCompareWith } : {}),
		});
	}

	if (parsed.debug) {
		console.log(`whenParser: debug "${conditionSrc}"`, parsed);
	}

	return parsed;
}

function withState(obj, dataSources) {
	const entries = Object.entries(obj);

	const get = (k, v) => {
		const isSpecialCase = ['is', 'isnot'].includes(k) && v === 'DEFINED';
		const isNumber = !Number.isNaN(_.toNumber(v));

		if (typeof v !== 'string' || isSpecialCase || isNumber) return v + '';

		const source = v.split('_', 1)[0];

		if (source === 'static') return v.replace('static_', '');

		if (source in dataSources)
			return _.get(dataSources, v.replace('_', '.'));

		if (source === 'global')
			return StateManager.get(v.replace('global_', ''));

		if (v.includes('.')) return _.get(dataSources, v);

		return v;
	};

	const coerce = (value) => {
		if (value == null) return value + '';

		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch (error) {
				return value;
			}
		}

		if ((value + '').toLowerCase() === 'false') return '0';
		if ((value + '').toLowerCase() === 'true') return '1';

		return String(value);
	};

	const filled = entries.reduce((acc, [key, value]) => {
		const _value = get(key, value);

		const shouldCoerce = !['then', 'else'].includes(key);

		acc[key] = shouldCoerce ? coerce(_value) : _value;
		return acc;
	}, {});

	return filled;
}

function checkMatches(conditionsFilled, conditionsParsed) {
	if (![undefined, 'AND', 'OR'].includes(conditionsParsed.joiner))
		return false;

	const doesMatch = ({
		when,
		is,
		isnot,
		isSrc,
		isnotSrc,
		numberToCompareWith,
	}) => {
		// ? does not have "IS" OR "IS NOT" -- "WHEN something THEN this ELSE that"
		// ? "is" and "isnot" can be undefined because they were filled by values, so we assert isSrc and isnotSrc are undefined
		if (
			!isSrc &&
			!isnotSrc &&
			is + '' === 'undefined' &&
			isnot + '' === 'undefined'
		) {
			const isNumber = !Number.isNaN(Number(when));

			const _when = isNumber ? Number(when) : when;

			const isNullOrUndefined = ['null', 'undefined'].includes(when + '');
			const isTruthy = Boolean(_when) && !isNullOrUndefined;

			return isTruthy;
		}

		if (is === 'DEFINED') return when !== 'undefined';
		if (isnot === 'DEFINED') return when === 'undefined';

		if (NUMBER_COMPARATORS[is] || NUMBER_COMPARATORS[isnot]) {
			const whenNum = Number(when);
			const _numberToCompareWith = Number(numberToCompareWith);

			const isGreater = whenNum > _numberToCompareWith;
			const isEqual = whenNum === _numberToCompareWith;
			const isLower = whenNum < _numberToCompareWith;

			if (is === NUMBER_COMPARATORS.GREATERTHAN) return isGreater;
			if (isnot === NUMBER_COMPARATORS.GREATERTHAN) return !isGreater;

			if (is === NUMBER_COMPARATORS.GREATEROREQUALTHAN)
				return isGreater || isEqual;
			if (isnot === NUMBER_COMPARATORS.GREATEROREQUALTHAN) return isLower;

			if (is === NUMBER_COMPARATORS.LESSTHAN) return isLower;
			if (isnot === NUMBER_COMPARATORS.LESSTHAN) return !isLower;

			if (is === NUMBER_COMPARATORS.LESSOREQUALTHAN)
				return isLower || isEqual;
			if (isnot === NUMBER_COMPARATORS.LESSOREQUALTHAN) return isGreater;
		}

		// ? "isSrc" equals "undefined" IF one used a condition like "WHEN prop1 IS undefined",
		// ? i.e "undefined" is a valid value and it does not come from state, thus making "is" have value "undefined" too
		const ISkeyword = isSrc === 'undefined' || is + '' !== 'undefined';
		if (ISkeyword) return when === is;

		const ISNOTkeyword =
			isnotSrc === 'undefined' || isnot + '' !== 'undefined';
		if (ISNOTkeyword) return when !== isnot;

		return false;
	};

	if (conditionsParsed.joiner === undefined)
		return doesMatch(conditionsFilled[0]);

	if (conditionsParsed.joiner === 'AND')
		return conditionsFilled.every(doesMatch);

	if (conditionsParsed.joiner === 'OR')
		return conditionsFilled.some(doesMatch);

	return false;
}

function getResult(conditionsFilled, conditionsParsed, dataSources) {
	const conditionMatches = checkMatches(conditionsFilled, conditionsParsed);

	let thenElseValues = {
		then: conditionsParsed.then,
		else: conditionsParsed.else,
	};

	// fill then/else if they are not default values, i.e one is using THEN/ELSE keywords
	if (thenElseValues.then !== true || thenElseValues.else !== false) {
		thenElseValues = withState(thenElseValues, dataSources);
	}

	// we coerce 0,1,true,false to "1"/"0", so we need to coerce back...
	const isBoolString = (x) => ['true', 'false'].includes(x + '');
	if ([conditionsParsed.then, thenElseValues.then].every(isBoolString)) {
		thenElseValues.then = thenElseValues.then + '' === 'true';
	}
	if ([conditionsParsed.else, thenElseValues.else].every(isBoolString)) {
		thenElseValues.else = thenElseValues.else + '' === 'true';
	}

	return conditionMatches ? thenElseValues.then : thenElseValues.else;
}

function roleFunctionsWithState(conditions, dataSources) {
	const conditionsFilled = [];

	const allUserRoles =
		'global' in dataSources
			? _.get(dataSources, 'global.currentUser.roles', [])
			: StateManager.get('currentUser.roles', false, []);

	const roleMap = StateManager.get('rolesMap');

	const userRolesMapped = allUserRoles.map((x) => {
		const roleInfo = roleMap[x.roleId];
		return {
			...x,
			...roleInfo,
		};
	});

	const functionsThatExpectRoles = ['HASROLES', 'HASBRANCHROLES'];

	const getFunctionNameAndExpectedRoles = (condition) => {
		// at this point everything is a role function
		const expectedRolesMatches = /\((.*?)\)/g.exec(condition.when);

		const functionName = condition.when.includes('(')
			? condition.when.split('(')[0].trim()
			: condition.when;

		// did not provide expected roles and function relies on it
		if (
			expectedRolesMatches == null &&
			functionsThatExpectRoles.includes(functionName)
		) {
			conditionsFilled.push({ ...condition, when: 'undefined' });
			return { functionName: undefined, expectedRoles: [] };
		}

		const expectedRoles =
			expectedRolesMatches != null
				? expectedRolesMatches[1].split(',').map((x) => x.trim())
				: [];

		return { functionName, expectedRoles };
	};

	for (const x of conditions) {
		const isKnownFunction = Object.keys(ROLE_FUNCTIONS).some((fn) =>
			x.when.includes(fn),
		);

		if (!isKnownFunction) {
			conditionsFilled.push(x);
			continue;
		}

		const { expectedRoles, functionName } =
			getFunctionNameAndExpectedRoles(x);

		if (!functionName || !(functionName in ROLE_FUNCTIONS)) continue;

		const handler = ROLE_FUNCTIONS[functionName];

		const hasRole = handler(userRolesMapped, expectedRoles);

		conditionsFilled.push({
			...x,
			when: hasRole ? '1' : 'should',
			is: hasRole ? '1' : 'not_match',
		});
	}

	return conditionsFilled;
}

export function whenRunner(statement, dataSources = {}, logger = console.log) {
	if (!statement || typeof statement !== 'string') return undefined;

	const conditionsParsed = whenParser(statement, logger);

	if (conditionsParsed.conditions.length === 0) {
		logger({
			error: `When Runner: problem parsing condition "${statement}"`,
			dataSources,
		});

		return undefined;
	}

	if (conditionsParsed.debug) {
		logger({
			message: `When runner for: "${statement}" - Parsed`,
			dataSources,
			conditions: conditionsParsed.conditions,
			joiner: conditionsParsed.joiner,
		});
	}

	if (Object.keys(ROLE_FUNCTIONS).some((fn) => statement.includes(fn))) {
		conditionsParsed.conditions = roleFunctionsWithState(
			conditionsParsed.conditions,
			dataSources,
		);
	}

	const conditionsFilled = conditionsParsed.conditions.map((x) =>
		withState(x, dataSources),
	);

	const result = getResult(conditionsFilled, conditionsParsed, dataSources);

	if (conditionsParsed.debug) {
		logger({
			message: `When runner for: "${statement}" - Results`,
			conditionsFilled,
			result,
		});
	}

	return result;
}
