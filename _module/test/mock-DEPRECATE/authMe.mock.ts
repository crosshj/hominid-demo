import { defineMock } from 'vite-plugin-mock-dev-server';

export default defineMock({
	url: '/api/auth/me',
	headers: {
		'Content-Type': 'application/json',
	},
	body: {
		name: 'Harrison Cross',
		picture:
			'https://gravatar.com/avatar/bef68c820137296a1f4e862cfd44c58c?s=480&r=pg',
	},
});
