import * as fs from 'fs';

export const write = ({ content, outputDir, outputFileName }) => {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	if (fs.existsSync(outputFileName)) {
		fs.unlinkSync(outputFileName, (err) => {
			if (err) throw err;
			console.info('Old file deleted. Creating new file...');
		});
	}

	return fs.writeFile(outputFileName, content, { flag: 'w+' }, (err) => {
		console.info('New file created successfully');
		if (err) {
			throw new Error(err);
		}
	});
};
