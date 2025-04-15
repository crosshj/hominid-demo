import React from 'react';

import { submitFormData } from '../services';
import { toast } from 'react-toastify';
import { Routes } from './global/routes';
import { StateManager } from '../../state/state';

export const GlobalContext = React.createContext({});

interface DispatchArgs {
	type?: string;
	target?: string;
	param?: string;
	redirect?: string;
	href?: string;
	hard?: boolean;
}

const dispatchTypeToHandler: Record<string, (args: DispatchArgs) => void> = {
	navigate: ({ href, target, hard = false }) => {
		if (hard) {
			window.location.assign(href as string);
			return;
		}
		if (href?.match && href.match(/^https?:\/\//)) {
			const _target = target || '_self';
			window.open(href, _target);
			return;
		}

		if (target === '_blank') {
			window.open(href, '_blank');
			return;
		}

		Routes.push(href || target);
	},
	step: ({ target }) => {
		StateManager.update('selectedStep', target);
	},
	selectListView: ({ target }) => {
		StateManager.update('selectedListView', target);
	},
	submit: async ({ target, param, redirect }) => {
		const input = [
			{
				name: target,
				uuid: '',
				args: JSON.stringify({ id: param }),
			},
		];
		const toastId = toast.loading('Wait...');
		const res = await submitFormData(input);
		toast.dismiss(toastId);
		const { results } = res[0] || {};
		if (results === 'success') {
			if (redirect) {
				Routes.push(redirect);
				// setPreviousMenu(selectedMenu);
				// setMenu({ target: redirect });
			}
			return;
		}
		toast.error('Something went wrong!');
	},
	setDialogState: ({ target, param }) => {
		StateManager.update(target, param ? param : true);
	},
};

export const GlobalProvider = ({ api, children, customComponents }: any) => {
	const [selectedMenu]: any = StateManager.useListener('menu', undefined, {
		note: '<GlobalContext />',
	});

	const value = {
		dispatch: (args: DispatchArgs) => {
			const { type } = args || {};

			const handler = dispatchTypeToHandler[type || ''];

			if (handler) {
				handler(args);
				return;
			}

			console.log(`action ${type} doesn't exist`);
		},
		navigate: (href: string, opts = {}) => {
			const navigateDispatcher = dispatchTypeToHandler['navigate'];
			return navigateDispatcher({ href, ...opts });
		},
		menu: selectedMenu?.target,
		param: selectedMenu?.param,
		api,
		customComponents,
	};
	if (!GlobalContext) return null;
	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	);
};
