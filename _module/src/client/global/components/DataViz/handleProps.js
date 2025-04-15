export function handleProps(parentRest, GlobalState) {
	const needsGlobal = Object.entries(parentRest)
		.filter(([prop, value]) => {
			if (typeof value !== 'string') return false;
			return value.includes('global_');
		})
		.map(([prop, value]) => {
			return {
				prop,
				globalProp: value.replace('global_', ''),
			};
		});
	const globalToListenTo = needsGlobal.map(({ globalProp }) => globalProp);

	for (const { prop, globalProp } of needsGlobal) {
		parentRest[prop] = GlobalState[globalProp];
	}
	return globalToListenTo;
}
