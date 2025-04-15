/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useEffect } from 'react';
import { StateManager } from '../state/state';

import { contextParser } from '../global/utils';
import { WIP } from '../global/components/WIP';
import { ScreenLoader } from '../global/components/ScreenLoader';

import { getChildren } from './tree';
import { Selector } from './components/Selector';
import {
	isStatefulComponent,
	handleStatefulComponents,
} from './core/statefulComponents';

import { flowQueueCleaner } from '../global/components/Flow';

const pushFlowHandlers = (args: any) => {
	const { flows = [], upsert = false } = args;
	const newFlowHandlersByKey = _.groupBy(flows, 'key');
	const currentFlowHandlersByKey =
		upsert + '' === 'true' ? StateManager.get('flowHandlersByKey') : {};
	const update = {
		...currentFlowHandlersByKey,
		...newFlowHandlersByKey,
	};
	StateManager.update('flowHandlersByKey', update);
};

/*
    TODO: some context items (Data,Flow) should not be treated as react components
    instead, they are stateful javacript items: data/listeners/handlers
    Also, this "Framework" component is really just a "Page" component
*/
const handleSpecialContextItems = ({
	UIContext = [],
	upsertFlows = false,
}: any) => {
	const statefulComponents: any[] = [];
	const flows: any[] = [];

	for (const x of UIContext) {
		if ((x as any).type === 'Flow') {
			flows.push(x);
		}
		if (isStatefulComponent(x)) {
			statefulComponents.push(x);
		}
	}
	if (statefulComponents.length) {
		handleStatefulComponents(statefulComponents);
	}
	pushFlowHandlers({ flows, upsert: upsertFlows });
};

export const FrameworkFromContext = ({ UIContext = [], upsertFlows }: any) => {
	if (!UIContext) return null;
	handleSpecialContextItems({ UIContext, upsertFlows });

	const __UIContext = UIContext.filter((x: any) => !isStatefulComponent(x));
	const parsedContext = contextParser(__UIContext);
	const tree = UIContext.find((item: any) =>
		['PageFragment', 'Page'].includes(item.type),
	);

	if (!tree) return null;
	tree.children = getChildren(tree, parsedContext);

	// go into react
	return <Selector {...tree} />;
};

export const FrameworkFragment = (args: any) => {
	const {
		props: { contents = '', showLoading },
	} = args;
	const contentsKey = contents.replace('global_', '');
	const [UIContext]: any = StateManager.useListener(contentsKey, false);
	const loading = !Array.isArray(UIContext) || UIContext.length === 0;
	if (loading && showLoading + '' === 'false') {
		return null;
	}
	if (loading) {
		return <div className="placeholder" />;
	}
	return <FrameworkFromContext {...{ UIContext, upsertFlows: true }} />;
};

export const Framework = () => {
	// are useListeners what is needed here?

	const [UIContext]: any = StateManager.useListener('UIContext', false, {
		unique: true,
		note: `Framework:UIContext`,
	});
	const menu = StateManager.get('menu', false, {});
	const previousMenu = StateManager.get('previousMenu', false, {});
	const loading = StateManager.get('loading', false, false);

	//TODO: should this be on FrameworkFragment as well? or maybe should be on FrameworkFromContext
	useEffect(() => {
		const queueCleaner = setInterval(flowQueueCleaner, 5000);

		return () => {
			clearInterval(queueCleaner);
		};
	}, []);

	if (!Array.isArray(UIContext) || UIContext.length === 0) {
		return loading ? (
			<ScreenLoader />
		) : (
			<WIP menu={menu?.target} link={previousMenu?.target} />
		);
	}

	return <FrameworkFromContext {...{ UIContext, upsertFlows: false }} />;
};
