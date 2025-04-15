import { useRef, useEffect } from 'react';
import _ from 'lodash';
import hljs from 'highlight.js';
import { Box } from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import 'highlight.js/styles/github.css';

export function CodeBlock(props: any) {
	let {
		language = 'xml',
		textContent: textContentSrc = '',
		children, //ignore
		_src, //ignore
		parent, //ignore
		label, //ignore
		target, //ignore
		value, //ignore
		type, //ignore
		...rest
	} = props;

	const theme: any = useTheme();
	const highlightRef = useRef(null);
	const textContent = _.isObject(textContentSrc)
		? JSON.stringify(textContentSrc, null, 4)
		: textContentSrc;
	if (_.isObject(textContentSrc)) {
		language = 'json';
	}
	useEffect(() => {
		const toHighlight = highlightRef.current;
		if (toHighlight === null) return;
		hljs.highlightElement(toHighlight);
	}, [textContent]);

	const style = {
		margin: 0,
		background: 'transparent',
		filter: '',
	};
	if (theme.mode === 'dark') {
		//rest.backgroundColor = theme.palette.background.contrast;
		style.filter = 'invert(1) hue-rotate(180deg)';
	}

	return (
		<Box
			padding="1em 2em"
			borderRadius={theme.shape.borderRadius}
			sx={{
				backgroundColor: 'action.disabledBackground',
			}}
			{...rest}
		>
			<pre
				className={`language-${language.trim()}`}
				style={style}
				ref={highlightRef}
			>
				<code>{textContent}</code>
			</pre>
		</Box>
	);
}
