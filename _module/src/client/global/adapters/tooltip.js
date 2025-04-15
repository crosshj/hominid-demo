import { Tooltip } from '../components/Tooltip';

export const tooltipAdapter = ({ label, props }) => {
	return { Component: Tooltip, title: label, ...props };
};
