import { Button as MuiButton } from '@mui/material';
import { Icon } from '../../Icon';
import { StateManager } from '../../../../state/state';
import { useGlobal } from '../../../hooks/useGlobal';

const buttonVariantMap = {
	text: 'text',
	primary: 'contained',
	secondary: 'outlined',
	navigate: 'navigate',

	default: 'outlined',
};

export const Button = (args: any = {}) => {
	const {
		children,
		label,
		variant = 'secondary',
		target,
		onClickShimmed,
		sx,
		...props
	} = args;

	const loading = false;

	const [{ param: globalParam = '' } = {}]: any = StateManager.useListener(
		'menu',
		undefined,
		{
			note: 'StandardComponents/Button.tsx',
			key: props.key,
		},
	);

	const { dispatch }: any = useGlobal() || {};

	if (!label && !children) return null;

	const _variant =
		(buttonVariantMap as any)[variant.toLowerCase()] ||
		buttonVariantMap['default'];

	const startIcon = args.leftIcon && (
		<Icon icon={args.leftIcon} color={args.leftIconColor || ''} />
	);
	const endIcon = args.rightIcon && (
		<Icon icon={args.rightIcon} color={args.rightIconColor || ''} />
	);

	return (
		<MuiButton
			disabled={loading}
			startIcon={startIcon}
			endIcon={endIcon}
			variant={_variant}
			color="primary"
			label={label}
			onClick={(e) => {
				onClickShimmed(e, { dispatch, globalParam });
			}}
			{...props}
			sx={{
				width: 'max-content',
				minWidth: 'fit-content',
				maxWidth: { xs: 'unset', md: 'max-content' },
				textDecoration: _variant === 'text' && target && 'underline',
				...sx,
			}}
		>
			{label ? label : children}
		</MuiButton>
	);
};
