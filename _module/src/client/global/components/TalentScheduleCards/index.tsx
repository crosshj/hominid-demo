import _ from 'lodash';
import { Box, Button, Divider, Typography } from '@mui/material';

import { runFlow } from '../_MUI/core/runFlow';
import { withStateful } from '../../../framework/core/withStateful';
import { getLongDate } from '../../utils/getLongDate';
import { StringFormatters } from '../../utils/parseProperties';
import { convertDecimalHours } from '../../utils/convertDecimalHours';
import { clone } from '../../utils';

interface Shift {
	ActualEnd: string;
	ActualStart: string;
	WorkDt: string;
	AssignmentID: number;
	AssignmentName: string;
	ScheduledHrs: number;
	ScheduledShiftDefinitionID: number;
	ScheduledWorkDate: string | null;
	ScheduledWorkEnd: string | null;
	ShiftName: string | null;
	ShiftType: 'Scheduled' | 'Unscheduled';
	TotalHrsWkd: number;
}

const groupByShiftStartTime = (shifts: Shift[]) => {
	if (!Array.isArray(shifts)) return [];

	return shifts.reduce(
		(acc, currentShift) => {
			const shiftStartTimeLong = getLongDate(currentShift.WorkDt);

			const shiftsInThisDay = clone(acc[shiftStartTimeLong] || []);

			shiftsInThisDay.push(currentShift);
			acc[shiftStartTimeLong] = shiftsInThisDay;
			return acc;
		},
		{} as Record<string, Shift[]>,
	);
};

const wrapInSquareBrackets = (str: any) => `[${str}]`;

const TalentScheduleCards = (args: any = {}) => {
	const { data = [], onViewShiftHref } = args;

	const shiftsByStartTimeDict = groupByShiftStartTime(data);

	const onClickShift = (shiftData: Shift) => {
		runFlow({ href: onViewShiftHref }, { flowArgs: shiftData });
	};

	return Object.entries(shiftsByStartTimeDict).map(
		([shiftDateLong, shifts]) => {
			const shiftsCards = shifts.map((shiftData) => {
				const { hours, minutes } = convertDecimalHours(
					shiftData.TotalHrsWkd,
				);

				return (
					<Box
						className="talent-shift-card"
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '10px',
							padding: '10px',

							border: '1px solid #606060',
							borderRadius: '6px',
						}}
					>
						<Typography variant="h4">
							{shiftData.AssignmentName}
						</Typography>
						<Typography variant="h3" sx={{ textAlign: 'center' }}>
							{shiftData.ShiftName}
						</Typography>
						<Typography variant="h4" sx={{ marginTop: '5px' }}>
							LOGGED HOURS
						</Typography>
						<Typography variant="h2" fontWeight="400">
							{hours}h {minutes}m
						</Typography>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'baseline',
								gap: '10px',
								marginBottom: '5px',
							}}
						>
							<Typography variant="h4">
								SCHEDULED HOURS
							</Typography>
							<Typography variant="h4">
								{wrapInSquareBrackets(
									shiftData.ShiftType === 'Unscheduled'
										? 'ANY'
										: StringFormatters.fixed2(
												shiftData.ScheduledHrs,
										  ),
								)}
							</Typography>
						</Box>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'baseline',
								gap: '10px',
							}}
						>
							<Typography variant="h4">START TIME</Typography>
							<Typography variant="h4">
								{wrapInSquareBrackets(
									shiftData.ShiftType === 'Unscheduled'
										? 'ANY'
										: StringFormatters.time(
												shiftData.ScheduledWorkDate,
										  ),
								)}
							</Typography>
						</Box>

						<Button
							fullWidth
							color="success"
							variant="text"
							sx={{
								marginTop: '5px',
								fontWeight: 700,
							}}
							onClick={() => onClickShift(shiftData)}
						>
							View Shift
						</Button>
					</Box>
				);
			});

			return (
				<Box
					className="talent-schedule"
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr 1fr',
						gap: '20px',
						marginTop: '40px',
					}}
				>
					<Divider
						sx={{
							gridRow: 1,
							gridColumn: '1/-1',
						}}
					>
						{shiftDateLong}
					</Divider>

					{shiftsCards}
				</Box>
			);
		},
	);
};

export { TalentScheduleCards };
export default withStateful(TalentScheduleCards as any);
