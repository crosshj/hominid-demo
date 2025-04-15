import { Success } from '../components/Success';

export const successAdapter = ({ children, label, props }) => {
	return { Component: Success, children, label, ...props };
};
