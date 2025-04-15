import { Dashboard } from '../components/Dashboard';

export const dashboardAdapter = ({ children, props }) => {
	return { Component: Dashboard, children, ...props };
};
