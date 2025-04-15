import React from 'react';
import { Stack } from '@mui/material';
import { useGlobal } from '../../global/hooks/useGlobal';

export const Link = ({ to, href, children, ...props }: any) => {
	const { navigate }: any = useGlobal() || {};

	const handleClick = (e: any) => {
		e.preventDefault();
		if (href) {
			if (href.includes('/logout')) {
				sessionStorage.removeItem('param');
				sessionStorage.removeItem('target');
			}
			window.location.assign(href);
			return;
		}
		if (!to) return;
		navigate(to);
	};

	return (
		<a href={href || to} onClick={handleClick}>
			<Stack {...props}>{children}</Stack>
		</a>
	);
};
