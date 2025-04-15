import { Data } from '../components/Data';

export const dataAdapter = ({ props, ...rest }) => {
	return { Component: Data, ...props, ...rest };
};
