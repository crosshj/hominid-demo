import { Button as MuiButton } from '@mui/material';

import { Icon } from '../Icon';
import { StateManager } from '../../../state/state';
import { useGlobal } from '../../hooks/useGlobal';
import { runFlow } from '../_MUI/core/runFlow';

export const Button = ({
	children,
	label,
	variant = 'secondary',
	type,
	target,
	param: localParam,
	redirect,
	gridVariant = 'half',
	actionType,
	leftIcon,
	leftIconColor,
	rightIcon,
	rightIconColor,
	...props
}: any) => {
	// const [loading] = StateManager.useListener('loading', undefined, {
	// 	note: 'for button',
	// });
	const loading = false;

	const [{ param: globalParam = '' } = {}]: any = StateManager.useListener(
		'menu',
		undefined,
		{
			note: 'components/Button.tsx',
			key: props.key,
		},
	);

	const { dispatch }: any = useGlobal() || {};

	const handleClick = async (e: any) => {
		e.stopPropagation && e.stopPropagation();
		let { row: rowSrc, useData } = props;
		const { __rowIndex, __rowStateKey } = props;

		if (
			typeof rowSrc === 'undefined' &&
			![__rowIndex, __rowStateKey].some((x) => typeof x === 'undefined')
		) {
			rowSrc = StateManager.get(`${__rowStateKey}.${__rowIndex}`);
		}

		const flowArgs = Object.assign(rowSrc, {
			index: __rowIndex,
		});
		const flowHasRun = runFlow({ propsIntact: props }, { flowArgs });
		if (flowHasRun) {
			e.preventDefault && e.preventDefault();

			// DEPRECATE: in favor of flowArgs
			if (useData && Object.keys(rowSrc || {}).length) {
				StateManager.update(useData, rowSrc);
			}

			return;
		}

		if (props?.href || '') {
			e.preventDefault && e.preventDefault();
			dispatch({
				type: 'navigate',
				href: props.href,
				target: props.target,
			});
			return;
		}
		let param = localParam || globalParam;

		// DEPRECATE: in favor of flowArgs
		if (useData && Object.keys(rowSrc || {}).length) {
			StateManager.update(useData, rowSrc);
		}

		dispatch({ type: actionType || type, target, param, redirect });
	};
	const getButtonVariant = () => {
		switch (variant) {
			case 'primary':
				return 'contained';
			case 'secondary':
				return 'outlined';
			case 'text':
				return 'text';
			case 'navigate':
				return 'navigate';
			default:
				return 'outlined';
		}
	};

	const buttonVariant = getButtonVariant();
	if (!label && !children) return null;
	return (
		<MuiButton
			variant={buttonVariant}
			type={type}
			onClick={handleClick}
			disabled={loading}
			sx={{
				width: 'max-content',
				minWidth: 'fit-content',
				maxWidth: { xs: 'unset', md: 'max-content' },
				textDecoration:
					buttonVariant === 'text' && target && 'underline',
			}}
			startIcon={
				leftIcon && <Icon icon={leftIcon} color={leftIconColor} />
			}
			endIcon={
				rightIcon && <Icon icon={rightIcon} color={rightIconColor} />
			}
			{...props}
		>
			{label || children}
		</MuiButton>
	);
};
