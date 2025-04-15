import { Action } from '../components/Action';
import { StateManager } from '../../state/state';

const ActionAdapter = (args) => {
	const { props } = args;

	const { useFlow: flowKey } = props || {};

	const UIContext = StateManager.get('UIContext', false, []);
	const hasValidFlow = UIContext.some(
		(x) => x?.type === 'Flow' && x.key === flowKey,
	);

	const handleClick = () => {
		const currentQueue = StateManager.get('flowQueue', false, []);
		const newFlow = { key: flowKey };
		StateManager.update('flowQueue', [...currentQueue, newFlow]);
	};

	return {
		Component: Action,
		...props,
		handleClick,
		hasValidFlow,
	};
};

export const actionAdapter = ActionAdapter;
