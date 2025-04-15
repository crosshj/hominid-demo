import { Selector } from '../../../framework/components/Selector';
import { bindItem } from './Map.utils';

export const Map = (args: any = {}) => {
	const {
		items = [],
		debug,
		_src: { children },
	} = args;
	if (!items?.length) return null;

	if (debug) {
		console.log({ _: 'Map:debug', items });
	}

	return (
		<>
			{items.map((item: any, i: any) => {
				return children.map((child: any, j: any) => {
					const boundChild = bindItem(child, item);
					return (
						<Selector
							{...{ ...boundChild }}
							key={`${boundChild.key}.${i}.${j}`}
						/>
					);
				});
			})}
		</>
	);
};
