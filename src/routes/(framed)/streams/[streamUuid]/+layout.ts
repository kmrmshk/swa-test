import type { LayoutLoad } from './$types';
import { DistributionsApi } from '$lib/apis';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

async function fetchDistribution(streamUuid:string) {
	return await DistributionsApi.getApiV1Distributions({
			uuid: streamUuid,
			part: 'youtube'
		})
		.catch(e => {
				console.error(e);
				return null;
		});
}

export const load: LayoutLoad = async ({ params }) => {
	const streamUuid:string = params?.streamUuid ?? '';

	let distribution = await fetchDistribution(streamUuid);
	if(!streamUuid || !distribution) {
		throw error(404, '配信は存在しません');
	} else if(distribution?.status === 'Disabled') {
		throw error(410, '配信は削除されました');
	}

	if (distribution?.status !== 'Live' && distribution?.status !== 'Upcoming') {
		throw redirect(301, `/archives/${ distribution.uuid }`);
	}

	return {
		streamUuid,
		distribution
	}
}
