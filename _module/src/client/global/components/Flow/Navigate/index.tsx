import { useGlobal } from '../../../hooks/useGlobal';
import { StateManager } from '../../../../state/state';

import { clone } from '../../../utils';
import {
	fillPropsWithTokens,
	replaceTokens,
	withNamespaced,
} from '../../../utils/parseProperties';

const addQueryToRoute = (args: any) => {
	try {
		const { query, route, state } = args;
		const queryFilled = Object.keys(query).length
			? fillPropsWithTokens(query, state)
			: undefined;
		let routeWithQuery = route;
		if (queryFilled && !route.includes('?')) {
			routeWithQuery = `${route}?${new URLSearchParams(
				queryFilled as any,
			).toString()}`;
		}
		return routeWithQuery;
	} catch (e) {
		return args?.route;
	}
};

export const Navigate = (args: any) => {
	const { onStep, path, hard, blank, flowArgs, debug } = args;
	let { route, query } = withNamespaced(args) as any;

	const { navigate }: any = useGlobal();

	if (route === 'refresh') {
		route = (document as any)?.location?.href;
	}

	if (debug) {
		console.log({ _: 'Navigate:debug', args });
	}

	if (route) {
		const _state = clone(StateManager.get());
		const routeWithQuery = addQueryToRoute({
			route,
			query,
			state: { global: _state, flowArgs },
		});
		Object.assign(_state, {
			flowArgs,
		});

		const tokenFilledRoute = replaceTokens(
			_state,
			routeWithQuery.replace('global_', ''),
		);

		if (debug) {
			console.log({
				_: 'Navigate:route',
				route,
				query,
				routeWithQuery,
				tokenFilledRoute,
			});
		}

		onStep && onStep();
		navigate(tokenFilledRoute, {
			hard,
			target: blank ? '_blank' : undefined,
		});
	}

	if (path) {
		const state = StateManager.get();
		const { history, Event, dispatchEvent } = window;
		const tokenFilledPath = replaceTokens(state, path);
		history.pushState({}, '', tokenFilledPath);
		const pushStateEvent = new Event('pushstate');
		dispatchEvent(pushStateEvent);
		onStep && onStep();
	}

	return null;
};
