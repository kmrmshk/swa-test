/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError ({ error = '' }) {
	console.error('[Error] ', error);
}