import { renderMode } from '../../utils/renderMode';

// TODO: assess whether dispatch is deprecated or not
export const buildColumns = (columns = [], rowMatrix, dispatch) => {
	const mapColumn = (x) => {
		const { key, label, children, target } = x;

		const {
			variant = 'text',
			flex,
			hideable = 'false',
			...rest
		} = x?.props || {};
		const field = key.split('.').pop();
		const renderer = renderMode[variant] || renderMode['text'];

		const renderCell = (...args) => {
			const { row, column } = args[0] || {};
			const options = rowMatrix.getOptions({ column, row });
			if (options === 'default') {
				const [firstArgs, ...restArgs] = args;
				const newArgs = [{ ...firstArgs, dispatch }, ...restArgs];
				return renderer(...newArgs);
			}
			if (!options?.length)
				return React.createElement(React.Fragment, null);

			const legitValue =
				typeof args.value !== 'undefined' && args.value !== null;
			const value = !!legitValue ? args.value : '';

			const onChange = (e) => {
				//TODO: if dropdown changes, should also zero dependant fields
				args[0]?.onChange({
					row,
					update: { [column]: e.target.value },
				});
			};

			if (options === 'input') {
				return renderMode.input2({ value, onChange });
			}
			if (options === 'hidden') {
				return React.createElement(React.Fragment, null);
			}

			return renderMode.options({
				options,
				value,
				onChange,
			});
		};

		return {
			...rest,
			target,
			label,
			children,
			field,
			headerName: x?.label,
			renderCell,
			maxWidth: '1000',
			flex: flex || 1,
			hideable: hideable === 'true' ? true : false,
		};
	};
	const columnsDef = columns
		.filter((x) => x.type.toLowerCase() === 'column')
		.map(mapColumn);
	return columnsDef;
};
