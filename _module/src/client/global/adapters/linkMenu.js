import { Menu } from '../components/Menu';

export const linkMenuAdapter = ({ type, label, props }) => {
	return { Component: Menu, label, ...props };
};
