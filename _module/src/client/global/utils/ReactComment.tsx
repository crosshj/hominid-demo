import { forwardRef } from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			['x-comment']: any;
		}
	}
}

export const ReactComment = forwardRef((props: any, ref) => {
	return <x-comment ref={ref}>{props.text}</x-comment>;
});
