import { FormDate } from '../components/FormDate';

export const formDateAdapter = ({ props }) => {
	return { Component: FormDate, ...props };
};
