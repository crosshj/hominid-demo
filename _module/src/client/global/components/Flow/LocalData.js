import _ from 'lodash';

import { getPath } from './SetData/getPath';
import { getNewData } from './SetData/getNewData';
import { StateManager } from '../../../state/state';
import { clone } from '../../utils';

export const LocalData = (props) => {
	const { debug, name, results = [], flowArgs = {}, onStep } = props;

	setTimeout(() => {
		const dataSources = {
			flowArgs,
			global: StateManager.get(),
			results,
		};

		if (debug) {
			console.log({
				_: 'LocalData:debug:beforeParsing',
				props,
				flowArgs,
			});
		}

		const pathToUpdate = getPath(name, dataSources).split('.');
		const newData = getNewData(props, dataSources);

		// ! must use lodash's set because we use lodash-like paths
		// @laian will revisit
		//const localData = {};
		const localData = clone(flowArgs);
		_.set(localData, pathToUpdate, newData);

		if (debug) {
			console.log({
				_: 'LocalData:debug:afterParse',
				newData,
				flowArgs,
			});
		}

		onStep && onStep(clone(localData));
	}, 1);

	return null;
};
