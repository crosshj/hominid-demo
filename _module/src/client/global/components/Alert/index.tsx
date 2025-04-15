import * as M from '@mui/material';

const isVisible = ({ showOn }: any = {}) => {
	try {
		if (showOn.trim() === '*') return true;
		const showList = ('//localhost,' + showOn)
			.split(',')
			.map((x: any) => x.trim());
		const shouldShow = showList.find(
			(x: any) => document.location?.href.includes(x),
		);
		return shouldShow;
	} catch (e) {}
};

export const Alert = (args: any) => {
	const {
		children,
		severity = 'info',
		title,
		label,
		textContent,
		key,
		...propsSrc
	} = args;
	const { showOn = '', ...props } = propsSrc;
	if (!isVisible({ showOn })) return null;
	return (
		<M.Alert
			{...props}
			severity={severity}
			icon={false}
			style={{ marginTop: '1em' }}
		>
			{(title || label) && <M.AlertTitle>{title || label}</M.AlertTitle>}
			{textContent ? (
				<div style={{ whiteSpace: 'pre-line' }}>{textContent}</div>
			) : (
				children
			)}
		</M.Alert>
	);
};
