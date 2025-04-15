module.exports = async () => {
	return {
		rootDir: '..',
		moduleFileExtensions: ['js', 'json', 'gql'],
		//testPathIgnorePatterns: ['.integration.'],
		watchPathIgnorePatterns: ['/.test'],
	};
};
