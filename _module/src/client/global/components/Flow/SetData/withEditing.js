export const withEditing = (props) => {
	let { data, editing, name, ...rest } = props;

	const markEditing = editing + '' === 'true';
	const unmarkEditing = editing + '' === 'false';
	if (markEditing) {
		data = true;
		name += '.editing';
	}
	if (unmarkEditing) {
		data = undefined;
		name += '.editing';
	}
	return {
		forceUpdate: unmarkEditing,
		data,
		name,
		...rest,
	};
};
