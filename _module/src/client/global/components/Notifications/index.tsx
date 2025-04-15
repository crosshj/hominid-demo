import _ from 'lodash';
import { Check } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

import { Box, Button, IconButton, Menu, Typography } from '@mui/material';

import { Routes } from '../../contexts/global/routes';
import { submitFormData } from '../../services';
import { StateManager } from '../../../state/state';

import { NotificationBadge } from './Badge';

import { ItemsContainer, Container } from './styles';
import type { Notification } from './types';

import { processEvent, shouldHandle } from './notificationLogic';

export const NotificationComponent = () => {
	const [anchor, setAnchor] = useState(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		const updateHandler = async () => {
			const processedUpdate = processEvent();

			for (const trig of processedUpdate.trigger) {
				StateManager.update('flowQueue', [
					...StateManager.get('flowQueue', false, []),
					{ key: trig.handler, args: trig.notificationsToRead },
				]);
			}

			setNotifications(processedUpdate.notify as Notification[]);

			if (!processedUpdate.markRead.length) return;
			await submitFormData([
				{
					name: 'ui.sp_Upsert',
					call: 'notifications',
					args: JSON.stringify({
						operation: 'read',
						notificationID: processedUpdate.markRead.join(','),
					}),
				},
			]);
		};
		return StateManager.subscribe(shouldHandle, updateHandler, {
			note: `_internal:notifications`,
		});
	}, [shouldHandle, processEvent]);

	const handleClick = (e: any) => setAnchor(e.target);
	const handleClose = () => setAnchor(null);

	const readNotification = (notificationID: number) => {
		if (Number.isNaN(notificationID)) return;

		const newNotifications = notifications.filter(
			(n) => n.NotificationID !== notificationID,
		);

		setNotifications(newNotifications);

		submitFormData([
			{
				name: 'ui.sp_Upsert',
				call: 'notifications',

				args: JSON.stringify({
					operation: 'read',
					notificationID: String(notificationID),
				}),
			},
		]);
	};
	const onReadNotification = async (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.stopPropagation(); // <= avoid event going to parent, which in this case redirects the user

		const notificationID = _.toNumber(
			(event.target as SVGElement).attributes.getNamedItem(
				'data-notificationID',
			)?.value,
		);

		readNotification(notificationID);
	};
	const onReadAllNotifications = async () => {
		setNotifications([]);

		submitFormData([
			{
				name: 'ui.sp_Upsert',
				call: 'notifications',

				args: JSON.stringify({
					operation: 'read',
					notificationID: _.map(
						notifications,
						'NotificationID',
					).join(),
				}),
			},
		]);
	};

	return (
		<>
			<IconButton
				size="large"
				edge="start"
				aria-label="open drawer"
				onClick={handleClick}
				sx={{ color: 'white' }}
			>
				<NotificationBadge
					amountOfNotifications={notifications.length}
				/>
			</IconButton>

			<Menu
				open={Boolean(anchor)}
				anchorEl={anchor}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				sx={{
					minWidth: '350px',
					overflow: 'hidden',
				}}
			>
				<Container>
					<Button
						fullWidth
						onClick={onReadAllNotifications}
						sx={{
							display:
								notifications.length > 0
									? 'inline-flex'
									: 'none !important',
							height: '50px',
							marginBottom: '-8px', // why? <Menu> has a default padding-bottom of 8px that I couldn't remove
						}}
					>
						Read all notifications
					</Button>
					<ItemsContainer>
						{notifications.length > 0 ? (
							notifications?.map((n) => {
								const route = `${n.routeName}${n.SubjectID}`;

								return (
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											gap: '10px',
											padding: '2px 5px 6px 20px',
											cursor: 'pointer',

											'&:hover': {
												'background-color':
													'rgba(0, 0, 0, 0.04)',
											},
										}}
										onClick={async () => {
											Routes.push(route);
											readNotification(n.NotificationID);
										}}
									>
										<Typography variant="body1">
											{n.NotificationBody}
										</Typography>

										<IconButton
											data-notificationID={
												n.NotificationID
											}
											onClick={onReadNotification}
											color="primary"
										>
											<Check
												data-notificationID={
													n.NotificationID
												}
											/>
										</IconButton>
									</Box>
								);
							})
						) : (
							<Box padding="10px 18px 8px 21px">
								<Typography variant="body1">
									You don't have any new notifications.
								</Typography>
							</Box>
						)}
					</ItemsContainer>
				</Container>
			</Menu>
		</>
	);
};
