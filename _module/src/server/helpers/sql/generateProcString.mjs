import path from 'path';
import { readContext } from './context/readContext.js';
import { readForm } from './form/readForm.js';
import { write } from './write.js';

const type = process.argv[process.argv.length - 2];
const pathArg = process.argv[process.argv.length - 1];
const fullPath = path.resolve(pathArg);

const fileName = pathArg?.split('/');
const [objName] = fileName[fileName.length - 1]?.split('.');

const outputDir = type === 'form' ? './outputs/forms/' : './outputs/context/';
const outputFileName = `${outputDir}/${objName}.txt`;

const reader = type === 'form' ? readForm : readContext;

const read = async () => {
	try {
		const fileContent = await import(fullPath);
		const content = await reader({ content: fileContent, objName });
		return write({ content, outputDir, outputFileName });
	} catch (err) {
		return err;
	}
};

try {
	read();
} catch (err) {
	console.error('err', err);
}
