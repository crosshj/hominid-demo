const config = {
	//setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	testEnvironment: 'jest-environment-jsdom',
	testPathIgnorePatterns: ['.integration.'],
	transform: {
		'^.+\\.(j|t)sx?$': '@swc/jest',
	},
};

module.exports = config;
