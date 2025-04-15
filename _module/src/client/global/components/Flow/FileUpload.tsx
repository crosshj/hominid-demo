import { useEffect } from 'react';
import { StateManager } from '../../../state/state';

export const FileUpload = (args: any = {}) => {
	const {
		flowArgs,
		onStep,
		fileKey: fileKeySrc,
		fileBody: fileBodySrc,
		debug,
	} = args;

	const fileKey = StateManager.get(
		fileKeySrc.replace('global_', ''),
		false,
		'',
	);
	const fileBody = StateManager.get(
		fileBodySrc.replace('global_', ''),
		false,
		'',
	);

	if (debug) {
		console.log({
			_: 'FileUpload debug:',
			flowArgs,
			fileBody,
			fileKey,
			fileKeySrc,
			fileBodySrc,
		});
	}

	const uploadObject = async () => {
		await fetch(window.location.origin + '/api/s3', {
			method: 'POST',
			body: JSON.stringify({ fileBody, fileKey }),
			headers: { 'Content-Type': 'application/json' },
		});

		onStep();
	};

	useEffect(() => {
		uploadObject();
	}, []);

	return null;
};
