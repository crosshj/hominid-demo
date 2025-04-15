import * as M from '@mui/material';
import { gridVariantMap } from '../utils/grid';
import { StateManager } from '../../../state/state';

const get = (t: any, path: any) =>
	path && path.split('.').reduce((r: any, k: any) => r?.[k], t);

export const TextField = (args: any) => {
	const {
		id,
		label,
		defaultValue,
		gridVariant = 'full',
		underline = true,
		disabled = false,
	} = args;
	const [state]: any = StateManager.useListener();
	const [idValue, setId]: any = StateManager.useListener(id);
	const gridProps = (gridVariantMap as any)[gridVariant];

	let { value = '' } = args;
	if (typeof idValue === 'undefined') {
		const [, token] = (value || '').match(/{{(.*)}}/) || [];
		const tokenValue = get(state, token) || '';
		value = (value || '').replace(
			`{{${token}}}`,
			tokenValue || defaultValue || '',
		);
	} else {
		value = idValue;
	}
	const updateState = (e: any) => setId(e?.target?.value);

	return (
		<M.Grid {...gridProps} sx={{ height: '6rem' }}>
			<M.TextField
				disabled={disabled}
				fullWidth={true}
				label={label}
				onChange={updateState}
				value={value}
			></M.TextField>
			{underline && <M.Divider sx={{ marginY: 3 }} />}
		</M.Grid>
	);
};
