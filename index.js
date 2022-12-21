import process from 'node:process';
import {readFileSync, existsSync } from 'node:fs';
import helmet from 'helmet';
import express from 'express';
import cacheControl from 'express-cache-controller';
import {readFile} from 'fs/promises';
import {handler} from './build/handler.js';
import appInsights from 'applicationinsights';
import * as url from 'url';

process.on('uncaughtException', (err) => {
	console.error(`Caught exception: ${err}\n`);
	process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
	console.error('Detected UnhandledRejection');
	console.error('\tat:', p);
	console.error('\treason:', reason);
});

const base = url.fileURLToPath(new URL('.', import.meta.url));
const maintenanceFile = `${ base }/maintenance.json`;
const maintenanceData = existsSync(maintenanceFile) ? JSON.parse(readFileSync(maintenanceFile, 'utf-8')) : null;
const appConfig = JSON.parse(await readFile(new URL('./appconfig.json', import.meta.url)));
const define = Object.fromEntries(Object.entries(appConfig).map(([key, val]) => (
	[`import.meta.env.${ key.toLowerCase().replace(/:|\./g, "_") }`, JSON.stringify(val)]
)));
const port = process.env.PORT || JSON.parse(define['import.meta.env.vite_port']);
const host = JSON.parse(define['import.meta.env.vite_endpoint']);

if(!/localhost/.test(host)) {
	appInsights.setup()
		.setAutoDependencyCorrelation(true)
		.setAutoCollectRequests(true)
		.setAutoCollectPerformance(true, true)
		.setAutoCollectExceptions(true)
		.setAutoCollectDependencies(true)
		.setAutoCollectConsole(true, true)
		.setUseDiskRetryCaching(true)
		.setSendLiveMetrics(true)
		.setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
		.start();
}

const app = express();
app.set('etag', false);
app.set('port', port);
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());
app.use(helmet.dnsPrefetchControl({allow: true}));
app.use(helmet.frameguard({action: 'sameorigin'}));
app.use(helmet.permittedCrossDomainPolicies({permittedPolicies: 'none'}));
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
app.use(cacheControl({ public: true, maxAge: 60 * 60 }));

if (maintenanceData) {
	app.use(express.static('./build/client', {index: false}));
	app.set('view engine', 'ejs');
	app.set('views', base);
	app.get('*', async (_, res, next) => {
		res.cacheControl = {
			private: true,
			noCache: true,
			noStore: true,
			mustRevalidate: true
		};
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		res.status(503);
		res.render('./maintenance.ejs', maintenanceData);
		return next();
	});
}
else {
	app.use(handler);
}

const server = app.listen(port, _ => console.log(`Started on port ${port} (pid: ${process.pid})`));
server.keepAliveTimeout = 300000; // 5[min]
server.headersTimeout = 310000;
