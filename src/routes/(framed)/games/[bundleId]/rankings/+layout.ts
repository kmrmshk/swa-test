import type { LayoutLoad } from './$types';
import { writable } from 'svelte/store';
import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingSettingPublic as RankingSetting } from '$lib/apis';

const categories = [
	{
		label: 'イベント',
		path: 'games/[bundleId]/rankings/events',
		routeId: '/(framed)/games/[bundleId]/rankings/events'
	},
	{
		label: '通常',
		path: 'games/[bundleId]/rankings/usual',
		routeId: '/(framed)/games/[bundleId]/rankings/usual'
	}
];

const rankings = writable<{
	event: RankingSetting[];
	usual: RankingSetting[];
}>({ event: [], usual: [] });

export const load: LayoutLoad = () => {
	return {
		categories,
		rankings
	};
};