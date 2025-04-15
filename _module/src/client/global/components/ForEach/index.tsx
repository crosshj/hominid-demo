import { withStateful } from '../../../framework/core/withStateful';
import * as M from '@mui/material';
import { fill, getStatefulProps } from '../_MUI/core';
import { withNamespaced } from '../../utils/parseProperties';

// this is WIP

const ForEach = (args: any = {}) => {
	return null;
	const { of = [], children } = args;

	// console.log({ args });
	// @ts-ignore
	const { props } = children[1][0] || {};

	if (!(props.type in M)) {
		console.error(
			'ForEach only supports components from MaterialUI for now.',
		);
		return null;
	}

	// @ts-ignore
	const Component = withStateful(() => M[props.type]);

	// return null;
	return of.map((data: any, index: number) => {
		return (
			<Component {...withNamespaced(props.props)}>
				{props.children.map((x: any) => {
					// console.log(x.props, args._src.of);
					// @ts-ignore
					const Child = withStateful(M[x.type]);

					// return

					// const statefulProps = getStatefulProps(x.props, 'fillOwn');
					// console.log({ statefulProps });
					// const propsFilled = fill(
					// 	{
					// 		...x.props,
					// 		__rowIndex: index,
					// 		__rowStateKey: args._src.of,
					// 	},
					// 	statefulProps,
					// );

					// const allProps = {
					// 	...x.props,
					// 	...propsFilled,
					// };

					// console.log({ propsFilled, statefulProps, allProps });

					return <Child {...allProps} />;
				})}
			</Component>
		);
	});
};

export { ForEach };
export default withStateful(ForEach);
