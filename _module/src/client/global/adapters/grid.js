import { Grid } from '@mui/material';

export const gridAdapter = ({ children, props }) => {
	return { Component: Grid, children, ...props };
};
