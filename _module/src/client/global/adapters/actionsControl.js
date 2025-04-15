import { ActionsControl } from '../components/ActionsControl';

const ActionsControlAdapter = (args) => {
	const { children } = args;

	return { Component: ActionsControl, children };
};

export const actionsControlAdapter = ActionsControlAdapter;
