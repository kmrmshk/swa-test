import path from 'path';
import WindiCSS from 'vite-plugin-windicss';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { isoImport } from 'vite-plugin-iso-import';
import { createRequire } from 'module';
// import { visualizer } from 'rollup-plugin-visualizer';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const appConfig = require('./appconfig.json');
const profile = process.env.MODE || 'local';
const define = {};

console.log(`> profile: ${profile}\n`);

Object.entries(appConfig).forEach(([key, val]) => {
	const n = key.toLowerCase().replace(/:|\./g, "_");
	define[`import.meta.env.${n}`] = JSON.stringify(val);
});
Object.entries(packageJson.externals).forEach(([key, val]) => {
	define[`import.meta.env.${key}`] = JSON.stringify(val);
});
define["import.meta.env.client_version"] = JSON.stringify(
	`v${packageJson.version} ${packageJson.fingger.releasedAt}`
);

export default defineConfig(async () => {
	const isProd = define['import.meta.env.vite_environment'] === 'production';
	const port = define['import.meta.env.vite_port'].replace(/[^0-9]/g, '');
	const mode = define['import.meta.env.vite_environment'];

	return {
		define,
		mode,
		server: {
			port
		},
		preview: {
			port
		},
		resolve: {
			alias: {
				'@': [
					path.resolve('./src')
				],
			},
		},
		plugins: [
			sveltekit(),
			WindiCSS({
				//@ts-ignore
				config: 'windi.config.js',
				compile: isProd, // false: interpretation mode; true: compilation mode
				prefix: 'windi-', // set compilation mode style prefix
				verbose: true,
				silent: false,
				debug: !isProd,
				globalPreflight: true, // set preflight style is global or scoped
				globalUtility: true, // set utility style is global or scoped
			}),
			isoImport(),
			// visualizer({filename: 'stats.html'}),
		]
	};
});
