import { Card } from '../components/Card';

export const cardAdapter = ({ children, props, ...rest }) => {
	return { Component: Card, children, ...rest, ...props };
};
