import { TextField } from '../components/TextField';

export const textFieldAdapter = (args) => {
	const { label, props: inputProps, id } = args;
	const props = {
		...inputProps,
		id,
	};
	return { Component: TextField, label, ...props };
};
