import { cloneElement } from 'react';
import { StateManager } from '../../../state/state';

/* DEPRECATE */
export const Switch = ({
	source,
	param,
	children,
	type,
	id,
	key,
	label,
	...rest
}: any) => {
	const [sourceValue]: any = StateManager.useListener(source);
	const value = sourceValue ? sourceValue[param] : 'client';

	return (
		<>
			{children
				?.filter((child: any) => child?.props?.props?.value === value)
				?.map((child: any) => cloneElement(child, { ...rest }))}
		</>
	);
};
