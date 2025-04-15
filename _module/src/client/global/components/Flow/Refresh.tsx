import { StateManager } from '../../../state/state';

export const Refresh = (props: any) => {
	const { onStep, data } = props;

	setTimeout(() => {
		if (typeof data === 'undefined') return;
		StateManager.notify({ message: `refresh:${data}` } as any);
		onStep && onStep();
	}, 1);

	return null;
};
