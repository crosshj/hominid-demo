import dotenv from 'dotenv';
import path from 'path';
import typescript from 'rollup-plugin-typescript';
import filesize from 'rollup-plugin-filesize';
import graphql from '@rollup/plugin-graphql';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import externals from 'rollup-plugin-node-externals';
import css from 'rollup-plugin-import-css';
import { visualizer } from 'rollup-plugin-visualizer';
import versionInjector from 'rollup-plugin-version-injector';
dotenv.config();
//TODO: https://www.npmjs.com/package/@rollup/plugin-alias

const SHOULD_BUILD_SERVER = [undefined, 'true'].includes(
	process.env.BUILD_SERVER,
);

const CLIENT_CONFIG = {
	input: 'src/client/client.ts',
	output: [
		{
			dir: 'dist',
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
			plugins: [filesize()],
			globals: {
				react: 'React',
				'react-dom': 'ReactDOM',
			},
			manualChunks: (id) => {
				if (id.includes('node_modules') && !id.endsWith('.css')) {
					return 'vendor-client';
				}
			},
		},
	],
	plugins: [
		css({
			output: 'client.css',
			transform: (inCSS) => {
				return inCSS
					.split('\n')
					.filter((line) => !line.includes('sourceMappingURL'))
					.join('\n');
			},
		}),
		externals({
			deps: false,
			peerDeps: true,
			devDeps: true,
			builtinsPrefix: 'ignore',
			packagePath: path.join(process.cwd(), 'src/client/package.json'),
		}),
		resolve(),
		json(),
		graphql(),
		commonjs(),
		typescript(),
		versionInjector({
			logLevel: 'error',
			injectInTags: {
				fileRegexp: /\.(js|ts|jsx|tsk|html|css)$/,
				tagId: 'VI',
				dateFormat: 'isoDateTime',
			},
		}),
		visualizer({
			filename: 'stats-client.html',
			template: 'sunburst',
		}),
	],
	onwarn(warning, warn) {
		if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
			// ignores 'use client' warnings
			return;
		}
		warn(warning);
	},
};
const SERVER_CONFIG = {
	input: 'src/server/server.js',
	output: [
		{
			dir: 'dist',
			format: 'cjs',
			sourcemap: false,
			exports: 'named',
			plugins: [filesize()],
			manualChunks: (id) => {
				if (id.includes('node_modules')) {
					return 'vendor-server';
				}
			},
		},
	],
	plugins: [
		commonjs({
			ignoreDynamicRequires: true,
		}),
		resolve(),
		json(),
		externals({
			deps: false,
			peerDeps: true,
			devDeps: true,
			//builtinsPrefix: 'ignore',
			packagePath: path.join(process.cwd(), 'src/server/package.json'),
		}),
		versionInjector({ logLevel: 'error' }),
		visualizer({
			filename: 'stats-server.html',
			template: 'sunburst',
		}),
	],
};

const configs = [CLIENT_CONFIG];
// if (SHOULD_BUILD_SERVER) {
// 	configs.push(SERVER_CONFIG);
// }

export default configs;
