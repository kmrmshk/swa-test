<script lang="ts">
	import type { PageData } from './$types';
	import Metatags from '$lib/components/Metatags';
	import GameScoreRankingSkelton from '$lib/components/GameScoreRankingSkelton';
	import GameScoreRankingTable from '$lib/components/GameScoreRankingTable';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import max from 'date-fns/max/index.js';
	import format from 'date-fns/format/index.js';
	import formatISO from 'date-fns/formatISO/index.js';
	import subMonths from 'date-fns/subMonths/index.js';
	import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths/index.js';
	import map from 'lodash/map';
	import range from 'lodash/range';
	import throttle from 'lodash/throttle';
	import { GamesApi } from '$lib/apis';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingSettingPublic as RankingSetting,
		FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameRankingScorePublic as RankingScore
	} from '$lib/apis';

	type SubCategory = {
		name: string;
		value: number;
	}

	const length = 30;
	const defaultCategory = {
		name: '全期間',
		value: -1,
	}

	export let data:PageData;
	let bundleInfo = data.bundleInfo;
	let rankings = data.rankings;
	let categories = data.categories;

	let selectedModeIndex = 0;
	let selectedIndex = 0;
	let selectedMode:RankingSetting|null = null;
	let rankingData:Array<RankingScore> = [];
	let dateList:Array<Date> = [];
	let subCategories:Array<SubCategory> = [];
	let promise = Promise.resolve();
	let scroll:InfiniteScroll;
	let swiper = null;

	const fetchRankingsDebounce = throttle(() => addToPromise(fetchRankings), 250, { leading: true, trailing: false });

	function fetchRankings() {
		if( ! selectedMode ){
			return;
		}
		let fetchPromise;
		if( selectedIndex === 0 ){
			fetchPromise = GamesApi.getApiV1GamesRankingsOverall({
				bundleId: bundleInfo?.bundleId,
				rankingId: selectedMode.rankingId ?? '',
				limit: length,
				offset: rankingData.length
			});
		}
		else{
			fetchPromise = GamesApi.getApiV1GamesRankingsMonthly({
				bundleId: bundleInfo?.bundleId,
				rankingId: selectedMode.rankingId,
				month: formatISO( dateList[ subCategories[selectedIndex].value ] ),
				limit: length,
				offset: rankingData.length
			});
		}

		return fetchPromise.then(data => {
			if (data.length) {
				rankingData = rankingData.concat(data);
				scroll?.validate();
			}
		}).catch(console.error);
	}

	function updateMonthsRange() {
		const currentDate = new Date();
		const startDate = max([
			subMonths(currentDate, 6),
			new Date(bundleInfo?.releasedAt),
		]);
		const diffMonth = differenceInCalendarMonths(currentDate, startDate) + 1;
		dateList = range(0, diffMonth).map(o => {
			const target = subMonths(currentDate, o);
			return new Date(
				target.getUTCFullYear(),
				target.getUTCMonth(),
				1,
			);
		});
		subCategories = map(dateList, (item, index) => ({
			name: format(item, 'yyyy年MM月'),
			value: index,
		}));
		subCategories.unshift( defaultCategory )
	}

	function addToPromise(f:Function) {
		promise = promise.then(() => f());
	}

	$: modeCategories = map($rankings.usual, (item, index) => ({
		name: item.name,
		value: index,
	}));

	$: if (bundleInfo) {
		updateMonthsRange();
	}
	$: if ( selectedMode && selectedIndex !== null && bundleInfo?.bundleId) {
		rankingData = [];
		fetchRankingsDebounce();
	}
	$: {
		selectedMode = $rankings.usual[selectedModeIndex];
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ bundleInfo.title } | ランキング"
	description="{ bundleInfo.title } | ランキング"
/>

<GameScoreRankingSkelton
	bind:selectedIndex={selectedIndex}
	bundleId={ bundleInfo?.bundleId }
	{categories}
	{subCategories}
	hasEventRanking={ !! $rankings.event.length }
>
	<div slot="mode-categories" class="relative mb-5 lg:w-128 <lg:w-full">
		<Tabs value={ selectedModeIndex } secondary swipe class="min-h-9 px-6">
			<TabNav bind:swiper={swiper} centered spaceBetween={12} class="justify-center">
				{#each modeCategories as item}
					<TabNavItem shrink on:click={()=>{ selectedModeIndex = +item.value}} >{ item.name }</TabNavItem>
				{/each}
			</TabNav>
		</Tabs>
		<nav class="absolute top-0 left-0 py-1.5" on:click={ () => swiper().slidePrev() }>
			<i class="icon fingger-arrow-left text-2xl" />
		</nav>
		<nav class="absolute top-0 right-0 py-1.5" on:click={ () => swiper().slideNext() }>
			<i class="icon fingger-arrow-right text-2xl" />
		</nav>
	</div>

	<svelte:fragment slot="ranking" >
		<GameScoreRankingTable rankingData={ rankingData }>
			<InfiniteScroll
				bind:this={ scroll }
				on:more={ () => addToPromise(fetchRankings) }
			/>
		</GameScoreRankingTable>
	</svelte:fragment>
</GameScoreRankingSkelton>
