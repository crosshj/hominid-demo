import { Search } from '../components/Search';

export const searchAdapter = ({ label, props }) => {
	return { Component: Search, label, ...props };
};
