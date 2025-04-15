import { FlowPollManager } from '../../../state/flow';
import { StateManager } from '../../../state/state';

export const parsePath = (path) => {
	const parsed = (path || '').split('/').filter((x) => x.length);
	let param = [];
	let target = '';
	for (const frag of parsed) {
		if (!isNaN(frag)) {
			param = parsed.slice(parsed.indexOf(frag));
			break;
		}
		target = `${target}${frag[0].toUpperCase() + frag.slice(1)}`;
	}
	if (typeof target?.[0] !== 'string') {
		return { target: 'dashboard', param: '' };
	}
	target = target[0].toLowerCase() + target.slice(1);
	param = (param || []).join('/');

	//console.log({ m: 'parsing path', path, target, param });

	return { target, param };
};

export const Routes = () => {
	const { pathname = '' } = document.location;
	const { target, param } = parsePath(pathname);
	return { target, param };
};

// function shouldNotIntercept(navigationEvent) {
// 	return (
// 		!navigationEvent.canIntercept ||
// 		// If this is just a hashChange,
// 		// just let the browser handle scrolling to the content.
// 		navigationEvent.hashChange ||
// 		// If this is a download,
// 		// let the browser perform the download.
// 		navigationEvent.downloadRequest ||
// 		// If this is a form submission,
// 		// let that go to the server.
// 		navigationEvent.formData
// 	);
// }

const setMenu = ({ target: pathname = '', param: pathparam } = {}) => {
	let newPath = pathname;
	if (!newPath.startsWith('/')) {
		newPath = `/${newPath}`;
	}
	if (pathname.includes('root.')) {
		newPath = newPath.replace(/^root\./, '');
	}
	window.history.pushState({}, '', newPath);
	// const { target, param } = parsePath(pathname);
	// console.log('navigating...', { target, param });
	// menuSetter({ target, param });
};

Routes.setter = ({ menuSetter }) => {
	// window.addEventListener('popstate', (event) => {
	// 	const { pathname = '' } = document.location;
	// 	const { target, param } = parsePath(pathname);
	// 	menuSetter({ target, param });
	// });

	// https://caniuse.com/mdn-api_navigation
	// consider a polyfill:
	// - https://github.com/WICG/navigation-api
	// - https://github.com/virtualstate/navigation

	// see https://developer.chrome.com/docs/web-platform/navigation-api/
	// const { navigation } = window;
	// navigation.addEventListener('navigate', (navigateEvent) => {
	// 	if (shouldNotIntercept(navigateEvent)) return;
	// 	const { destination } = navigateEvent;
	// 	const { pathname = '' } = new URL(destination.url);
	// 	//console.log({ navigationType: navigateEvent.navigationType})
	// 	//TODO: something similar to ... document.title += " | hello"

	// 	navigateEvent.intercept({
	// 		handler: async () => {
	// 			const { target, param } = parsePath(pathname);
	// 			menuSetter({ target, param });
	// 		},
	// 	});
	// });

	return { setMenu };
};

const handleRelative = (path) => {
	if (typeof path?.startsWith === 'undefined') {
		console.warn({
			_: 'routes.handleRelative: possible malformed path',
			path,
		});
		return path || '/';
	}
	return path.startsWith('/') ? path : `/${path}`;
};

Routes.push = (path) => {
	const flowsBeforeClosing = StateManager.get('flowQueue:triggerOnClose');

	const thereAreFlowsToTrigger = flowsBeforeClosing?.length > 0;

	FlowPollManager.clearQueue();

	if (thereAreFlowsToTrigger) {
		const newQueue = flowsBeforeClosing.map((x) => ({
			key: x.key,
			args: { nextRoutePath: path },
		}));

		StateManager.update('flowQueue', newQueue);
		StateManager.update('flowQueue:triggerOnClose', []);
		return;
	}

	const { target, param } = parsePath(path);
	//const currentMenu = StateManager.get('menu');
	//StateManager.update('previousMenu', currentMenu);
	StateManager.update('menu', { target, param, path });
	//setMenu({ target, param });
	window.history.pushState({}, '', handleRelative(path));
};

Routes.pop = () => {
	const previousMenu = StateManager.get('previousMenu');
	StateManager.update('menu', previousMenu);
	//TODO: should be updating 'previousMenu' here as well (but how?)
	//StateManager.update('previousMenu', ???);
	window.history.pushState({}, '', handleRelative(previousMenu.path));
};

const handleBrowserPop = (event) => {
	const { pathname = '', hash } = document.location;
	const { target, param } = parsePath(pathname);

	FlowPollManager.clearQueue();

	if (window.DEBUG_POPSTATE) {
		console.log({ _: 'popstate: debug', pathname, hash, target, param });
	}
	StateManager.update('menu', { target, param, path: pathname, hash });
	//window.history.pushState({}, '', pathname);
};
window.addEventListener('popstate', handleBrowserPop);
