import _ from 'lodash';
import { FlowPollManager } from '../../../state/flow';
import { StateManager } from '../../../state/state';
import { whenRunner } from '../../utils/whenConditions';

const parseDisabledProp = (disabledProp?: string, flowArgs: any = {}) => {
	if (_.isNil(disabledProp) || _.isEmpty(disabledProp)) {
		return false;
	}

	return whenRunner(disabledProp, {
		flowArgs,
		global: StateManager.get(),
	});
};

export const Call = (props: any) => {
	const { debug, handler, delay, disabled = '', flowArgs, onStep } = props;

	const isDisabled = parseDisabledProp(disabled, flowArgs);

	debug && console.log('Call:', { handler, delay, isDisabled });
	if (isDisabled) {
		FlowPollManager.dequeue({ key: handler });
		onStep();
		return null;
	}

	const newFlow = {
		key: handler,
		debug,
		delay,
	};

	FlowPollManager.queue(newFlow);

	onStep();
	return null;
};
