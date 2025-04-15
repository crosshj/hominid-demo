import { Stack, Typography } from '@mui/material';
import { parseProperties } from '../../utils/parseProperties';
import { withStateful } from '../../../framework/core/withStateful';

const getChildren = ({ children }: any) => {
	if (!Array.isArray(children)) {
		return { page: children, sidebar: [] };
	}
	const page: any[] = [];
	const sidebar: any[] = [];
	for (const child of children) {
		if (child?.props?.props?.variant === 'sidebar-right') {
			sidebar.push(child);
			continue;
		}
		page.push(child);
	}
	if (sidebar.length > 1) {
		console.warn(
			'Page/<Stack variant="sidebar-right">: only one will be rendered per page!',
		);
	}
	return {
		page,
		sidebar: sidebar[0],
	};
};

const getProps = ({ properties }: any) => {
	const propsSrc = parseProperties(properties) || {};
	const page: any = {};
	for (const [key, value] of Object.entries(propsSrc)) {
		if (!key.startsWith('sx:')) {
			page[key] = value;
			continue;
		}
		if (typeof page.sx === 'undefined') page.sx = {};
		page.sx[key.replace(/^sx:/, '')] = value;
	}
	return { page };
};

export const Page = (args: any) => {
	const children = getChildren(args);
	const props = getProps(args);
	return (
		<>
			<Stack {...{ variant: 'page', ...props.page }}>
				{children.page}
			</Stack>
			{children?.sidebar && children.sidebar}
		</>
	);
};

export const PageFragment = ({ children }: any) => {
	return <>{children}</>;
};

export const PageHeader = ({ children, ...args }: any) => {
	const title = args?.title || args?.label;
	return (
		<Stack {...{ variant: 'page-header' }}>
			{title && <Typography variant="h2">{title}</Typography>}
			{children}
		</Stack>
	);
};

export const PageContent = withStateful(({ children, ...rest }: any) => {
	return <Stack {...{ variant: 'page-content', ...rest }}>{children}</Stack>;
});
