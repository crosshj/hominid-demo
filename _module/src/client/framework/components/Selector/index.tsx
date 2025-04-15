import { FrameworkFragment } from '../..';
import { adapterMap } from '../../../global/adapters/adapterMap';
import { genericAdapter } from '../../../global/adapters/generic';
import { cleanProps } from '../../../global/components/utils';
import { useGlobal } from '../../../global/hooks/useGlobal';

const GenericComponent = (args: any) => {
	const {
		Component,
		id,
		type,
		props = {},
		children = [],
		compProps,
		compRest,
	} = args;
	const _src = {
		id,
		children,
		type,
		...compProps,
		...compRest,
	};
	const cleanedProps = cleanProps(props);

	if (!Array.isArray(children)) {
		return (
			<Component {...cleanedProps} _src={_src}>
				<Selector {...children} />
			</Component>
		);
	}
	return (
		<Component {...cleanedProps} _src={_src}>
			{children.length > 0 &&
				children?.map((child, index) => {
					return <Selector key={`${type}-${index}`} {...child} />;
				})}
		</Component>
	);
};

export const Selector = (component: any) => {
	const { customComponents = {} }: any = useGlobal();
	const {
		id,
		type,
		props: compProps,
		children = [],
		...compRest
	} = component;

	if (!type) return null;
	if (type === 'Fragment') {
		return <FrameworkFragment {...component} />;
	}
	if (typeof customComponents?.[type] !== 'undefined') {
		//TODO: should be doing more here to "adapt" props
		return (
			<GenericComponent
				id={id}
				type={type}
				props={{
					...compRest,
					...compProps,
				}}
				Component={customComponents[type]}
				compProps={compProps}
				compRest={compRest}
			>
				{children}
			</GenericComponent>
		);
	}
	const adapter = (adapterMap as any)[type] || genericAdapter;

	const doesNotNeedAdapter = ['hidden'];

	if (doesNotNeedAdapter.includes(type)) return null;

	if (!adapter) {
		console.log('WARN: No adapter found for type ' + type);
		return null;
	}
	const { Component, ...props } = adapter(component);

	if (!Component) {
		if (type === 'Selector') {
			return <Selector {...component.props} />;
		}
		console.log(`WARN: component ${type} not registered`);
		return null;
	}

	return (
		<GenericComponent
			id={id}
			type={type}
			Component={Component}
			props={props}
			compProps={compProps}
			compRest={compRest}
		>
			{children}
		</GenericComponent>
	);
};
