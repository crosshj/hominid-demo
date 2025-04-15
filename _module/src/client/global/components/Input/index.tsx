import { Grid, MenuItem, TextField } from '@mui/material';
import { gridVariantMap } from '../utils/grid';
import { StateManager } from '../../../state/state';

const fieldContentChildren = ({
	name,
	select,
	renderedOptions,
	...rest
}: any) => (
	<TextField
		select={select}
		name={name}
		SelectProps={{
			MenuProps: {
				sx: { maxHeight: 400 },
			},
		}}
		{...rest}
		inputProps={{ 'data-testid': `input-${name}` }}
	>
		{renderedOptions}
	</TextField>
);

const FieldContent = (fieldProps: any) => {
	const {
		select,
		options,
		grid = false,
		name,
		gridProps,
		...rest
	} = fieldProps;

	const renderedOptions =
		select && options?.length > 0 ? (
			options?.map((option: any) => (
				<MenuItem key={option?.value} value={option?.value}>
					{option?.label}
				</MenuItem>
			))
		) : (
			<MenuItem key={0} disabled={true}>
				No Options
			</MenuItem>
		);

	return grid ? (
		<Grid key={name} item {...gridProps}>
			{fieldContentChildren({ name, select, renderedOptions, ...rest })}
		</Grid>
	) : (
		fieldContentChildren({ name, select, renderedOptions, ...rest })
	);
};

export const Input = ({
	gridVariant,
	select,
	hidden,
	setValue,
	parentForm,
	context,
	schema,
	fieldName,
	fullWidth = true,
	...props
}: any) => {
	const [thisValue, thisSetter]: any = StateManager.useListener(
		props?._src?.useData,
	);
	//console.log({ props, thisValue });
	const wrappedOnChange = (event: any) => {
		thisSetter(event.target.value);
	};

	const gridProps = (gridVariantMap as any)[gridVariant];

	if (hidden) return null;

	const textFieldProps = {
		...props,
		select,
		fullWidth,
		gridProps,
		inputProps: { 'data-testid': 'input-component' },
		onChange: wrappedOnChange,
		value: thisValue,
	};

	return <FieldContent {...textFieldProps} />;
};
