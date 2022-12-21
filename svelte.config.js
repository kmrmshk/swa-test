import adapter from 'svelte-adapter-azure-swa';
import preprocess from 'svelte-preprocess';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const appConfig = require('./appconfig.json');
const dev = appConfig['Vite:Environment'] === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		version: {
			name: Date.now().toString(),
			pollInterval: dev ? 60000 : 3600000
		},
		files: {
			assets: 'static',
			lib: 'src/lib',
			params: 'src/params',
			routes: 'src/routes',
			serviceWorker: 'src/worker',
			appTemplate: 'src/app.html',
			hooks: {
				server: 'src/hooks.server.ts',
				client: 'src/hooks.client.ts'
			},
			serviceWorker: 'src/service-worker.ts'
		},
		csrf: {
			checkOrigin: true
		}
	},
};
export default config;