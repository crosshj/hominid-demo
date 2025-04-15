import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { TimeDisplayer, TimeLabel } from './style';
import { withStateful } from '../../../framework/core/withStateful';

const EVERY_SECOND = 1000;

function convertDecimalToTime(decimalHours: number) {
	let _hours = Math.floor(decimalHours);

	const decimalMinutes = (decimalHours - _hours) * 60;

	let _minutes = Math.floor(decimalMinutes);
	let _seconds = Math.round((decimalMinutes - _minutes) * 60);

	if (_seconds === 60) {
		_seconds = 0;
		_minutes += 1;
	}

	if (_minutes === 60) {
		_minutes = 0;
		_hours += 1;
	}

	return {
		hours: _hours,
		minutes: _minutes,
		seconds: _seconds,
	};
}

let seconds: number;
let minutes: number;
let hours: number;

const Counter = ({ status, selectedAssignment, loggedHoursAmount }: any) => {
	const [, forceUpdate] = useState(false);
	const [assignment, setAssignment] = useState(selectedAssignment);
	const [internalStatus, setInternalStatus] = useState('');

	const timeWorked = convertDecimalToTime(Number(loggedHoursAmount));

	const startCounter = ({ force = false } = {}) => {
		const hasAlreadyStarted =
			seconds !== undefined ||
			hours !== undefined ||
			minutes !== undefined;

		// when going on a break,  we should restart the counter and not take into account already worked hours
		if (status === 'OnBreak' && hasAlreadyStarted && force === false) {
			zeroCounter();
			return;
		}

		minutes = timeWorked.minutes;
		hours = timeWorked.hours;
		seconds = timeWorked.seconds;
		forceUpdate((p) => !p);
	};

	const updateTime = () => {
		seconds = (seconds + 1) % 60;
		if (seconds !== 0) {
			forceUpdate((p) => !p);
			return;
		}

		minutes = (minutes + 1) % 60;
		if (minutes !== 0) {
			forceUpdate((p) => !p);
			return;
		}

		hours = hours + 1;

		forceUpdate((p) => !p);
	};

	const zeroCounter = () => {
		hours = 0;
		minutes = 0;
		seconds = 0;
	};

	useEffect(() => {
		if (selectedAssignment === assignment) return;
		if (
			typeof loggedHoursAmount === 'undefined' ||
			loggedHoursAmount === 'undefined'
		)
			return;

		startCounter({ force: true });
		setAssignment(assignment);
	}, [selectedAssignment]);

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;
		if (
			typeof loggedHoursAmount === 'undefined' ||
			loggedHoursAmount === 'undefined'
		)
			return;

		// just went from clock in to clock out, no need to restart the counter, just keep showing the clocked in time
		if (internalStatus === 'ClockedIn' && status === 'ClockedOut') {
			setInternalStatus('ClockedOut');
			return;
		}

		startCounter();

		// should track time when both clocked in and on a break
		if (status !== 'ClockedOut') {
			timer = setInterval(updateTime, EVERY_SECOND);
		}

		setInternalStatus(status);
		return () => {
			timer && clearInterval(timer);
		};
	}, [status, loggedHoursAmount]);

	if (hours === undefined && minutes === undefined && seconds === undefined) {
		return null;
	}

	return (
		<Box
			display="flex"
			flexDirection="row"
			gap="0.75rem"
			justifyContent="center"
			alignItems="center"
			marginTop="2"
		>
			<TimeDisplayer>{hours}</TimeDisplayer>
			<TimeLabel>hr</TimeLabel>
			<TimeDisplayer>{minutes}</TimeDisplayer>
			<TimeLabel>min</TimeLabel>
			<TimeDisplayer>{seconds}</TimeDisplayer>
			<TimeLabel>sec</TimeLabel>
		</Box>
	);
};

export { Counter };
export default withStateful(Counter);
