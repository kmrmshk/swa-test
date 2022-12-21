import type { LayoutLoad } from './$types';
import { DistributionsApi, UsersApi } from '$lib/apis';
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

async function fetchDistributor(uuid:string) {
	return await UsersApi.getApiV1Users({ uuid })
		.catch(e => {
				console.error(e);
				return null;
		});
}

export const load: LayoutLoad = async ({ params }) => {
	const streamUuid:string = params?.archiveUuid ?? '';

	let distribution = await fetchDistribution(streamUuid);
	if(!streamUuid || !distribution) {
		throw error(404, '動画は存在しません');
	} else if(distribution?.status === 'Disabled') {
		throw error(410, '動画は削除されました');
	}

	let distributor = await fetchDistributor(distribution?.distributorUuid ?? '');
	if(!distributor) {
		throw error(410, 'ユーザが存在しません');
	}

	if (distribution?.status === 'Live' || distribution?.status === 'Upcoming') {
		throw redirect(302, `/streams/${ distribution.uuid }`);
	}

	return {
		streamUuid,
		distribution,
		distributor
	};
}
