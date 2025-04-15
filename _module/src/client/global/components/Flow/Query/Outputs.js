import _ from 'lodash';
import { StateManager } from '../../../../state/state';

export const handleProps = (queryProps, results) => {
	const outputsProps = Object.entries(queryProps).filter(([key]) =>
		key.startsWith('out_'),
	);

	for (const [key, pathToData] of outputsProps) {
		const path = key.split('_').slice(1).join('.');
		const value = pathToData.includes('static_')
			? pathToData.replace('static_', '')
			: _.get({ results }, pathToData);

		StateManager.update(path, value);
	}
};

const Outputs = {
	handleProps,
};

export default Outputs;
