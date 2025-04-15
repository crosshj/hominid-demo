import _ from 'lodash';
import { StateManager } from '../../../state/state';
import { cookieOperations } from '../../utils/cookies';

export const Cookie = (props: any) => {
	const {
		name,
		data = '',
		method = '',
		days,
		flowArgs = {},
		onStep,
		debug,
	} = props;

	const value =
		data && data?.replace && StateManager.get(data.replace(/^global_/, ''));

	if (debug) {
		console.log({
			_: 'Cookie: debug',
			name,
			value,
			method,
			days,
			flowArgs,
		});
	}

	if (typeof (cookieOperations as any)[method] === 'undefined') {
		console.error(`Flow: unrecognized Cookie method: ${method}`);
		onStep && onStep();
		return null;
	}

	const cookieValue = (cookieOperations as any)[method](name, value, days);
	const flowCookie = flowArgs.cookie || {};
	if (typeof cookieValue !== 'undefined') {
		flowCookie[name] = cookieValue || 'COOKIE';
	}

	if (debug) {
		console.log({
			_: 'Cookie: debug',
			name,
			cookieValue,
			flowArgs,
		});
	}

	onStep && onStep({ cookie: flowCookie });
	return null;
};
