import { useState } from 'react';
import { KeyboardArrowUp } from '@mui/icons-material';
import { IconButton, Stack, Card as MuiCard, Typography } from '@mui/material';

import { withStateful } from '../../../framework/core/withStateful';
import { useTheme } from '../../hooks/useTheme';

const getCardDefaultStyles = (
	theme: any,
	sxProp = {},
	isCollapsed: boolean,
) => ({
	width: '100%',
	overflow: 'visible',
	border: '1px solid #ccc',
	borderRadius: '20px',
	boxShadow: 'none',
	height: isCollapsed ? '5rem' : 'auto',
	// overflowY: 'hidden',
	padding: theme.spacing(3),
	margin: `${theme.spacing(3)} 0`,
	backgroundColor: theme.palette.background.default,
	...sxProp,
});

const CardComponent = ({
	label,
	children,

	collapsed = false,
	collapsible = false,
	sx,
	showMenu,
	...props
}: any) => {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);

	const theme = useTheme() as any;

	const handleToggleCollapse = () => {
		setIsCollapsed((p) => !p);
	};

	const cardDefaultStyles = getCardDefaultStyles(theme, sx, isCollapsed);

	return (
		<MuiCard sx={cardDefaultStyles} {...props}>
			<Stack
				width="100%"
				minHeight={label ? '45px' : '0px'}
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Typography variant="h2">{label}</Typography>
				{collapsible && (
					<IconButton onClick={handleToggleCollapse}>
						<KeyboardArrowUp
							sx={{
								transition: '0.2s',
								rotate: isCollapsed ? '180deg' : '0deg',
							}}
						/>
					</IconButton>
				)}
			</Stack>

			{!isCollapsed && children}
		</MuiCard>
	);
};

export const Card = withStateful(CardComponent);
