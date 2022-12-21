/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;

const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);

worker.addEventListener("install", (event) => {
	event.waitUntil(caches.open(FILES).then((cache) => cache.addAll(to_cache).then(() => { worker.skipWaiting(); })));
});

worker.addEventListener("activate", (event) => {
	event.waitUntil(caches.keys().then(async (keys) => {
		for (const key of keys) {
			if (key !== FILES) await caches.delete(key);
		}
		worker.clients.claim();
	}));
});

async function fetchAndCache(req: Request) {
	const cache = await caches.open(`offline${version}`);
	try {
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	} catch (err) {
		const res = await cache.match(req);
		if (res) return res;
		throw err;
	}
}

worker.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET" || event.request.headers.has("range")) return;
	const url = new URL(event.request.url);
	const isHTTP = url.protocol.startsWith("http");
	const isDevServerRequest = url.hostname === worker.location.hostname && url.port !== worker.location.port;
	const isStaticAsset = url.host === worker.location.host && staticAssets.has(url.pathname);
	const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset;
	if (isHTTP && !isDevServerRequest && !skipBecauseUncached) {
		event.respondWith((async () => {
			const cachedAsset = isStaticAsset && (await caches.match(event.request));
			return cachedAsset || fetchAndCache(event.request);
		})());
	}
});

worker.addEventListener("message", (event) => {
	const replyPort = event.ports[0];
	const message = event.data;
	if (replyPort && message && message.type === "SKIP_WAITING") {
		event.waitUntil(worker.skipWaiting().then(
			() => event.ports[0].postMessage({ error: null }),
			(error) => event.ports[0].postMessage({ error })
		));
	}
});