<script lang="ts">
	import type { PageData } from './$types';
	import Metatags from '$lib/components/Metatags';
	import GameScoreRankingSkelton from '$lib/components/GameScoreRankingSkelton';
	import GameScoreRankingTable from '$lib/components/GameScoreRankingTable';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import map from 'lodash/map';
	import throttle from 'lodash/throttle';
	import parseISO from 'date-fns/parseISO/index.js';
	import {
		GamesApi,
		type FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic as GameRankingScorePublic
	} from '$lib/apis';

	const length = 30;

	export let data:PageData;
	let bundleInfo = data.bundleInfo;
	let rankings = data.rankings;
	let categories = data.categories;

	let selectedIndex = 0;
	let rankingData:Array<GameRankingScorePublic> = [];
	let promise = Promise.resolve();
	let scroll:InfiniteScroll;

	const fetchRankingsDebounce = throttle(() => addToPromise(fetchRankings), 250, { leading: true, trailing: false });

	$: subCategories = map($rankings.event, (item, index) => ({
		name: item.name,
		value: index,
		current: Date.now() < parseISO(item.endAt).getTime()
	}));
	$: selectedCategory = $rankings.event[selectedIndex];

	$: if(selectedCategory && bundleInfo?.bundleId) {
		rankingData = [];
		fetchRankingsDebounce();
	}

	function fetchRankings() {
		if( ! selectedCategory ){
			return;
		}
		return GamesApi.getApiV1GamesRankingsOverall({
			bundleId: bundleInfo?.bundleId,
			rankingId: selectedCategory.rankingId,
			limit: length,
			offset: rankingData.length
		})
			.then(data => {
				if(data?.length) {
					rankingData = rankingData.concat(data);
					scroll?.validate();
				}
			})
			.catch(e => {
				console.error(e);
				return [];
			});;
	}

	function addToPromise(f:Function) {
		promise = promise.then(() => f());
	}

</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{bundleInfo.title} | ランキング"
	description="{bundleInfo.title} | ランキング"
/>

<GameScoreRankingSkelton
	bind:selectedIndex={selectedIndex}
	bundleId={ bundleInfo?.bundleId ?? '' }
	{categories}
	{subCategories}
	hasEventRanking={ !! $rankings.event.length }
	isEvent={true}
>
	<svelte:fragment slot='ranking' >
		<GameScoreRankingTable rankingData={ rankingData }>
			<InfiniteScroll
				bind:this={ scroll }
				on:more={ () => addToPromise(fetchRankings) }
			/>
		</GameScoreRankingTable>
	</svelte:fragment>
</GameScoreRankingSkelton>
