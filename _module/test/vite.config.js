import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// plugins: [
	// 	react(),
	// 	mockDevServerPlugin({
	// 		include: 'mock/**/*.mock.{ts,js,cjs,mjs,json,json5}',
	// 	}),
	// ],
	// server: {
	// 	proxy: {
	// 		'^/api': {
	// 			target: '',
	// 		},
	// 	},
	// },
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
