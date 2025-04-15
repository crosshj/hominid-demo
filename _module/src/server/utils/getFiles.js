const { platform } = require('node:process');
const { resolve, normalize } = require('path');
const { readdir } = require('fs').promises;

const getFiles = async (dir) => {
	try {
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(
			dirents.map((dirent) => {
				let res = resolve(dir, dirent.name);
				if (platform === 'win32') {
					res = normalize(res).replaceAll('\\', '/');
				}
				return dirent.isDirectory() ? getFiles(res) : res;
			})
		);
		return Array.prototype.concat(...files);
	} catch (e) {
		console.warn(e);
		return [];
	}
};

module.exports = getFiles;
