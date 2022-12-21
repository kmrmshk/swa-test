<script lang="ts">
	import LiveCard from '$lib/components/LiveCard';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import filter from 'lodash/filter';
	import { DistributionsApi } from '$lib/apis';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';

	export let bundleId = '';
	export let distributionUuid = '';
	export let gridOptions = '';
	export let autoplay = true;
	export let useCategory = false;

	const limit = 20;
	const categories = [
		'人気',
		'最新',
	];

	let distributions:Array<any> = [];
	let populars:Array<any> = [];
	let latests:Array<any> = [];
	let scroll:InfiniteScroll;
	let currentIndex = 0;
	let hasMore = true;

	$: filteredList = filter(distributions, item => {
		return (item.status === 'Live' || item.status === 'Completed') && item.uuid !== distributionUuid;
	});

	async function fetchDistributions(refreshing = false) {
		let additions = 0;
		if( currentIndex == 0 ){
			additions = await fetchPopulars(refreshing);
		} else{
			additions = await fetchLatests(refreshing);
		}
		hasMore = (additions > 0);
		if(refreshing || (!refreshing && additions > 0)) {
			scroll?.validate();
		}
	}

	// 人気
	function fetchPopulars(refreshing = false) {
		return DistributionsApi.getApiV1DistributionsGamesPopular({
				bundleId,
				limit,
				offset: refreshing ? 0 : populars.length
			})
			.then(data => {
				if(refreshing) {
					populars = data;
				} else {
					populars.push(...data);
				}
				distributions = populars;
				return data?.length ?? 0;
			})
			.catch(e => {
				console.error(e);
				return 0;
			});
	}

	// 最新
	function fetchLatests(refreshing = false) {
		return DistributionsApi.getApiV1DistributionsGamesLatest({
				bundleId,
				limit,
				offset: refreshing ? 0 : latests.length
			})
			.then(data => {
				if(refreshing) {
					latests = data;
				} else {
					latests.push(...data);
				}
				distributions = latests;
				return data?.length ?? 0;
			})
			.catch(e => {
				console.error(e);
				return 0;
			});
	}

	$: if(bundleId) {
		populars = [];
		latests = [];
		hasMore = true;
	}
</script>

{#if useCategory}
	<div class="pt-4 pb-4.5">
		<Tabs on:select={() => fetchDistributions(true)} swipe={false} secondary bind:value={ currentIndex }>
			<TabNav
				spaceBetween={12}
				centered
				class="w-full justify-center md:max-w-332px mx-auto">
				{#each categories as item, index}
					<TabNavItem value={ index }>{ item }</TabNavItem>
				{/each}
			</TabNav>
		</Tabs>
	</div>
{/if}

<section
	class="grid grid-cols-1 gap-4 { gridOptions }">
	{#each filteredList as item}
		<LiveCard
			onAir={item.status !== 'Completed'}
			streamUuid={item.uuid}
			distributorUuid="{item.distributorUuid}"
			title={item.title}
			thumbnailUrl={item.thumbnailUrl}
			userName={item.userName}
			userThumbnailUrl={item.userThumbnailUrl}
			viewersNum={item.status !== 'Completed' ? item.concurrentViewers : item.viewCount}
			startAt={item.actualStartAt}
			official={item.isOfficial}
			broadcastId={autoplay ? item.youTube.broadcastId : ''}
			duration={item.durationSeconds}
			tags={item.tags}
			sort={currentIndex ? 'latest' : 'popular'}
		/>
	{/each}
	<InfiniteScroll
		active={ !!bundleId && hasMore }
		bind:this={ scroll }
		on:more={ () => fetchDistributions() }
	/>
</section>
