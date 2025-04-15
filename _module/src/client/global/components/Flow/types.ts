export type GenericProps = {
	id: string;
	type: string;
	debug?: string;
	props: {
		type: string;
		id: string;
		props: GenericProps['props'];
		children: {}[];
	};
	children: {
		type: string;
		id: string;
		props: GenericProps['props'];
		children?: {};
	}[];
};

export type FlowComponentProps = GenericProps & {
	onStep: (data?: Record<string, any>) => void;
	onExit: () => void;
	flowArgs: GenericFlow['args'];
};
export interface FlowSupportedComponentsMap {
	[key: string]: (props: FlowComponentProps) => JSX.Element | null;
}

export interface GenericFlow {
	key: string;
	stepNumber?: number;
	args?: Record<string, any>;
}

export type FlowQueueListener = [
	GenericFlow[],
	(newQueue: GenericFlow[]) => void,
];
