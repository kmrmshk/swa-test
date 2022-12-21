import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { GamesApi, ProductsApi } from '$lib/apis';
import parseISO from 'date-fns/parseISO/index.js';

const endpoint = `${ import.meta.env.vite_endpoint }`;

function fetchCurrentTime() {
	return fetch(`${ endpoint }/api/time/now`).then(res => res.text()).then(parseInt);
}

function fetchGameInfo(bundleId:string) {
	return GamesApi.getApiV1Games({ bundleId })
		.then(data => {
			if (!data) {
				return Promise.reject('Invalid games: ' + bundleId);
			}
			return data;
		})
		.catch(e => {
			console.error(e);
			return null;
		});
}

function fetchProducts(bundleId:string) {
	return ProductsApi.getApiV1ProductsGames({ bundleId })
		.then(data => !!data && !!data.length)
		.catch(e => {
			console.error(e);
			return false;
		});
}

export const load: LayoutLoad = async ({ params }) => {
	const bundleId = params?.bundleId ?? '';
	let [hasProducts, info, time] = await Promise.all([
		fetchProducts(bundleId),
		fetchGameInfo(bundleId),
		fetchCurrentTime()
	]);
	if(!info) {
		throw redirect(302, '/games');
	}
	let bundleInfo = {
		...info,
		serviceEndAt: parseISO(info?.serviceEndAt ?? '').getTime(),
		currentTime: time
	}
	return {
		bundleId,
		bundleInfo,
		hasProducts
	}
}
