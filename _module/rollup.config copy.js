import { terser } from 'rollup-plugin-terser';
//import filesize from 'rollup-plugin-filesize';
//import gzipPlugin from 'rollup-plugin-gzip';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import graphql from '@rollup/plugin-graphql';

const SHOULD_BUILD_SERVER = process.env.BUILD_SERVER || true;

const CLIENT_CONFIG = {
	input: 'src/client/index.ts',
	inlineDynamicImports: true,
	output: [
		{
			//dir: 'dist',
			file: 'dist/client.mjs',
			format: 'module',
			name: 'awoss_web/client',
			//sourcemap: true,
			plugins: [
				//terser(),
				//gzipPlugin(),
				//filesize(),
				//
			],
		},
	],
	plugins: [
		typescript(), //for jsx
		graphql(),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
			preventAssignment: true,
		}),
		resolve({
			preferBuiltins: true,
			//browser: true,
		}),
		json(),
		nodePolyfills(), //TODO: but why do node core modules wind up in the build anyways?
		commonjs({
			include: /node_modules/,
			requireReturnsDefault: 'auto',
		}),
		//
	],
	external: ['react'],
	//external: [],
	onwarn(warning, warn) {
		if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
			return;
		}
		warn(warning);
	},
};

const SERVER_CONFIG = {
	input: 'src/server/index.ts',
	inlineDynamicImports: true,
	output: [
		{
			//dir: 'dist',
			file: 'dist/server.mjs',
			format: 'module',
			name: 'awoss_web/server',
			//sourcemap: true,
			plugins: [
				terser(),
				//gzipPlugin(),
				//filesize(),
				//
			],
		},
	],
	plugins: [
		typescript(),
		resolve({
			preferBuiltins: true,
		}),
		json(),
		commonjs(),
		//
	],
	external: [],
	onwarn(warning, warn) {
		if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
			return;
		}
		warn(warning);
	},
};

const configs = [CLIENT_CONFIG];

if (SHOULD_BUILD_SERVER) {
	configs.push(SERVER_CONFIG);
}

export default configs;
