import _ from 'lodash';
import { StateManager } from '../../../state/state';
import { fillPropsWithTokens } from '../../utils/parseProperties';

const tryParse = (v: any) => {
	try {
		return JSON.parse(v);
	} catch (e) {
		return v;
	}
};

export const Insert = (props: any) => {
	const {
		step, //ignore
		children, //ignore
		onExit, //ignore
		onStep,
		flowArgs,
		debug,
		...other
	} = props;
	let { name: path, ...insertProps } = other;

	setTimeout(() => {
		const global = StateManager.get();
		const { pathFilled } = fillPropsWithTokens(
			{ pathFilled: path },
			{ flowArgs },
			['flowArgs'],
		) as { pathFilled: string };

		const globalPath = pathFilled.replace('global_', '');
		const currentValue = StateManager.get(globalPath);

		const toInsert: any = {};
		if (debug) {
			console.log({ insertProps, toInsert, currentValue });
		}

		flowArgs.index = currentValue.length;
		for (const [k, v] of Object.entries(insertProps)) {
			if (_.isObject(v) || _.isFunction(v)) continue;

			const filled: any = fillPropsWithTokens(
				{ [k]: v },
				{ flowArgs, global },
				['flowArgs', 'global'],
			);
			toInsert[k] = tryParse(filled[k]);
		}

		StateManager.update(globalPath, [...currentValue, toInsert]);

		onStep && onStep();
	}, 1);

	return null;
};
