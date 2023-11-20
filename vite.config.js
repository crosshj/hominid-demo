import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			plugins: [
				NodeGlobalsPolyfillPlugin(),
				NodeModulesPolyfillPlugin(),
				//
			],
		},
	},
});
