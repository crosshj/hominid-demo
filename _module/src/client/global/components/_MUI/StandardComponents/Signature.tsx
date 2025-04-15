import { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { withRunFlowProps } from '../../../../framework/core/withRunFlowProps';

const INTERNAL_WIDTH = 800;
const INTERNAL_HEIGHT = 200;

type AvailableCallbacks = 'onUpdate' | 'onClear' | 'onEnd';

const getScaledCoords = (event: MouseEvent, canvas: HTMLCanvasElement) => {
	const rect = canvas.getBoundingClientRect();
	const actualWidth = canvas.clientWidth;
	const scale = INTERNAL_WIDTH / actualWidth;
	const actualHeight = canvas.clientHeight;
	const scaleY = INTERNAL_HEIGHT / actualHeight;
	const ScaledEvent = {
		clientX: rect.left + (event.clientX - rect.left) * scale,
		clientY: rect.top + (event.clientY - rect.top) * scaleY,
	};
	//console.log(`x:${ScaledEvent.clientX}, y: ${ScaledEvent.clientY}`);
	return ScaledEvent;
};

const fixMovement = (sigRef: React.MutableRefObject<SignatureCanvas>) => {
	const sigPadRef = sigRef.current.getSignaturePad();
	const canvas = sigRef.current.getCanvas();
	const ogHandlers = {
		strokeBegin: sigPadRef._strokeBegin.bind(sigPadRef),
		strokeMoveUpdate: sigPadRef._strokeMoveUpdate.bind(sigPadRef),
		strokeEnd: sigPadRef._strokeEnd.bind(sigPadRef),
	};
	sigPadRef._strokeBegin = (event: MouseEvent) => {
		const ScaledEvent = getScaledCoords(event, canvas);
		ogHandlers.strokeBegin(ScaledEvent);
	};
	(sigPadRef as any)._strokeMoveUpdate = (event: MouseEvent) => {
		const ScaledEvent = getScaledCoords(event, canvas);
		ogHandlers.strokeMoveUpdate(ScaledEvent);
	};
	sigPadRef._strokeEnd = (event: MouseEvent) => {
		const ScaledEvent = getScaledCoords(event, canvas);
		ogHandlers.strokeEnd(ScaledEvent);
	};
};

export const Signature = (args: any) => {
	const {
		width = '100%',
		height = 'auto',
		minWidth = '300px',
		maxWidth = '1000px',
		border = '1px solid currentColor',
		borderRadius = '5px',
		label = 'Signature',
		value,
		fromText,
		isReadOnly,
		readonly = {},
	} = args;

	const runFlow = withRunFlowProps({
		propsIntact: args,
	}) as Record<AvailableCallbacks, (props?: any) => void>;

	const sigRef = useRef<SignatureCanvas>({} as SignatureCanvas);

	useEffect(() => {
		if (!sigRef || !sigRef.current) return;
		if (isReadOnly) sigRef.current.off();
		fixMovement(sigRef);
		console.log('sigref or isReadOnly changed');
	}, [sigRef, isReadOnly]);

	useEffect(() => {
		const currentValue = sigRef.current.toDataURL('image/png');
		if (value === currentValue) {
			return;
		}
		const opts = {
			width: INTERNAL_WIDTH,
			height: INTERNAL_HEIGHT,
		};
		if (value && typeof value === 'string') {
			sigRef.current.fromDataURL(value, opts);
		}
		if (typeof value?.signature === 'string') {
			sigRef.current.fromDataURL(value.signature, opts);
		}
	}, [sigRef, value]);

	useEffect(() => {
		if (typeof fromText === 'undefined') return;
		const canvas = sigRef.current.getCanvas();
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font = 'italic 99px cursive';
		ctx.textAlign = 'start';
		ctx.textBaseline = 'middle';
		ctx.fillText(fromText, 15, 100, INTERNAL_WIDTH - 30);
		if (!runFlow.onEnd) return;
		const dataUri = sigRef.current.toDataURL('image/png');
		runFlow.onEnd({
			signature: dataUri,
			signatureFiles: [{ name: 'signature', value: dataUri }],
		});
	}, [sigRef, fromText]);

	const onClear = () => {
		sigRef.current.clear();
		if (!runFlow.onClear) return;
		const dataUri = sigRef.current.toDataURL('image/png');
		runFlow.onClear({
			signature: dataUri,
			signatureFiles: [{ name: 'signature', value: dataUri }],
		});
	};
	const onUpdate = () => {
		if (!runFlow.onUpdate) return;
		const dataUri = sigRef.current.toDataURL('image/png');
		runFlow.onUpdate({
			signature: dataUri,
			signatureFiles: [{ name: 'signature', value: dataUri }],
		});
	};
	const onEnd = () => {
		if (!runFlow.onEnd) return;
		const dataUri = sigRef.current.toDataURL('image/png');
		runFlow.onEnd({
			signature: dataUri,
			signatureFiles: [{ name: 'signature', value: dataUri }],
		});
	};

	if (isReadOnly && value) {
		return (
			<Box>
				{label && (
					<Typography variant="body1" mb="0.5em">
						{label}
					</Typography>
				)}
				<Box
					display="flex"
					flexDirection="column"
					border={border}
					borderRadius={borderRadius}
					width={width}
					height={height}
					minWidth={minWidth}
					maxWidth={maxWidth}
					{...readonly}
				>
					<img src={value} alt="signature" />
				</Box>
			</Box>
		);
	}

	return (
		<Box>
			{label && (
				<Typography variant="body1" mb="0.5em">
					{label}
				</Typography>
			)}
			<Box
				display="flex"
				flexDirection="column"
				border={border}
				borderRadius={borderRadius}
				width={width}
				height={height}
				minWidth={minWidth}
				maxWidth={maxWidth}
			>
				<SignatureCanvas
					ref={sigRef}
					clearOnResize={false}
					dotSize={2}
					onEnd={onEnd}
					penColor="black"
					canvasProps={{
						className: 'signatureCanvas',
						width: INTERNAL_WIDTH + 'px',
						height: INTERNAL_HEIGHT + 'px',
					}}
				/>
			</Box>
			<Box display="flex" alignItems="center" gap="5px">
				{args?.onClear && <Button onClick={onClear}>Clear</Button>}
				{args?.onUpdate && <Button onClick={onUpdate}>Update</Button>}
			</Box>
		</Box>
	);
};
