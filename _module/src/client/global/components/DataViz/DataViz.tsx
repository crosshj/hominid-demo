import * as Recharts from 'recharts';
import { handleProps } from './handleProps';
import { StateManager } from '../../../state/state';

export const DataViz = (args: any) => {
	const { _src: props } = args;
	const {
		type: parentType,
		children,
		id, //ignoring this
		order, //ignoring this
		parent, //ignoring this
		target, //ignoring this
		...parentRest
	} = props;
	const GlobalState = StateManager.get();
	// handle props (side effect of changing parentRest values)
	const globalListen = handleProps(parentRest, GlobalState);
	StateManager.useListener(globalListen);

	// NOTE: may have to rename this
	const RechartsContainer = (Recharts as any)[parentType];

	// children
	const rechartChildren = (children || []).map((child: any) => {
		const { type: childType, ...childRest } = child;
		const { props } = childRest;
		//TODO: make sure children of child are mapped as well
		return {
			Component: (Recharts as any)[childType],
			props,
		};
	});

	if (typeof RechartsContainer === 'undefined') {
		return <div>Unknown Graph Component</div>;
	}

	return (
		<RechartsContainer {...parentRest}>
			{rechartChildren.map(({ Component, props }: any) => (
				<Component {...props} />
			))}
		</RechartsContainer>
	);
};
