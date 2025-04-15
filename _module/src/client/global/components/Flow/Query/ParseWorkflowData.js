import _ from 'lodash';
import { StateManager } from '../../../../state/state';

/**
 * Checks if there is ParseWorkflowData and updates the state based on query results,
 * such as `results[0].stepNumber` and `results[0].ParentExtended`.
 *
 * @param {{ type: string, props: {} }[]} queryChildren
 * @param {object} queryResults
 * @returns
 */
export const handleResults = (queryChildren, queryResults) => {
	const component = queryChildren.find((x) => x.type === 'ParseWorkflowData');

	if (!component) {
		return;
	}

	const stepNumber = queryResults[0].stepNumber;
	const stepNumberName = _.get(component, 'props.stepNumberName', '').replace(
		'global_',
		'',
	);

	if (stepNumberName) {
		StateManager.update(stepNumberName, stepNumber);
	}

	const workflowData = queryResults[0].ParentExtended;

	if (!workflowData || _.isEmpty(workflowData)) {
		console.warn('ParseWorkflowData: called but workflow data is empty');
		return;
	}

	for (const [key, value] of Object.entries(workflowData)) {
		StateManager.update(key, value);
	}
};

const ParseWorkflowData = {
	handleResults,
};

export default ParseWorkflowData;
