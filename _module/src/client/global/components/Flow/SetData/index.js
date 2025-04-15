import _ from 'lodash';
import { StateManager } from '../../../../state/state';
import { clone } from '../../../utils';

import { getNewData } from './getNewData';
import { withEditing } from './withEditing';
import { getPath, getParentPath } from './getPath';

export const SetData = (props) => {
	const { onStep, results = [], debug, route, mutate, flowArgs = {} } = props;
	const { data, forceUpdate, name } = withEditing(props);

	if (!name) {
		window.alert('SetData with empty name property', { props });
		return null;
	}

	setTimeout(() => {
		const dataSources = {
			// ! this order matters
			flowArgs,
			global: clone(StateManager.get()),
			results,
		};

		const pathToUpdate = getPath(name, { flowArgs });
		const currentValue = StateManager.get(pathToUpdate);

		const newData = getNewData(
			{ data, route, mutate },
			dataSources,
			currentValue,
			debug,
		);

		if (debug) {
			console.log('SetData:debug', {
				data,
				flowArgs,
				route,
				mutate,
				results,
				currentValue,
				newData,
				pathToUpdate,
			});
		}

		if (_.isObject(newData) || newData !== currentValue) {
			StateManager.update(pathToUpdate, clone(newData));
		}

		if (forceUpdate) {
			const parentPath = getParentPath(pathToUpdate);
			StateManager.refresh(parentPath);
		}

		onStep && onStep();
	}, 1);

	return null;
};
