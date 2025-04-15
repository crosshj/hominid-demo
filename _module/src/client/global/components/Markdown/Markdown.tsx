import _ from 'lodash';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import { components as MUIComponents } from '../_MUI';
import { Icon } from '../Icon';
import { Alert, Box, Divider, Typography } from '@mui/material';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { dedent } from '../../utils';
import { useTheme } from '../../hooks/useTheme';

const Header = ({ node, level, ...props }: any) => {
	return <Typography variant={'h' + level} {...props} my={4} />;
};
const Code = (args: any) => {
	const { inline, children, className } = args;
	if (children?.[0].startsWith && children[0].startsWith('icon:')) {
		const [icon, color] = children[0].replace('icon:', '').split(';');
		return <Icon {...{ icon, color }} />;
	}
	if (inline) {
		const sx = {
			display: 'inline',
			px: 0.5,
			py: 0.25,
			backgroundColor: 'action.disabledBackground',
			color: (theme: any) =>
				theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
			border: '1px solid',
			borderColor: 'action.disabled',
			borderRadius: 1,
			// fontSize: '0.875rem',
			// fontWeight: '600',
		};
		return (
			<Box component="span" sx={sx}>
				{children}
			</Box>
		);
	}
	return (
		<CodeBlock
			language={className.replace('language-', '')}
			textContent={dedent(children.join('\n'))}
		/>
	);
};

export function Markdown(props: any) {
	let {
		textContent: textContentSrc = '',
		className = '',
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

	let textContent = _.isObject(textContentSrc)
		? JSON.stringify(textContentSrc, null, 4)
		: textContentSrc;

	className = [
		...className
			.split(' ')
			.map((x: any) => x.trim(x))
			.filter(Boolean),
		'markdown',
	]
		.join(' ')
		.trim();

	const components = {
		code: Code,
		a: ({ node, ...props }: any) => {
			if ((props?.href || '').startsWith('http')) {
				props.target = 'new';
			}
			return <MUIComponents.Link {...props} />;
		},
		blockquote: ({ node, ...props }: any) => {
			return <Alert severity="info" {...props} />;
		},
		hr: () => (
			<Box my={4}>
				<Divider
					sx={{
						color: theme.palette.text.primary,
						borderWidth: 2,
					}}
				/>
			</Box>
		),
		h1: Header,
		h2: Header,
		h3: Header,
		h4: Header,
		h5: Header,
		h6: Header,
	};

	//textContent = textContent.replaceAll('>', '//>');
	//console.log({ textContent });

	// TODO: probably would be better to use component replace for li/input
	// see https://github.com/remarkjs/react-markdown#appendix-b-components
	textContent = textContent
		.replaceAll('- [ ]', '⬜️')
		.replaceAll('- [X]', '✅')
		.replaceAll('- [!]', '💔');

	return (
		<ReactMarkdown
			className={className}
			remarkPlugins={[remarkGfm, remarkBreaks]}
			components={components}
			{...rest}
		>
			{textContent.trim()}
		</ReactMarkdown>
	);
}
