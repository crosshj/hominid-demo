import { defineConfig } from 'cypress';
import { config } from 'dotenv';

config({ path: './.env' });

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
