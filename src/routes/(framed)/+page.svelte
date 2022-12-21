<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { DistributionsApi, NotificationsApi } from '$lib/apis';
	import { onMount, onDestroy } from 'svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import Tabs from '$lib/components/Tabs/Tabs.svelte';
	import TabNav from '$lib/components/Tabs/TabNav.svelte';
	import TabNavItem from '$lib/components/Tabs/TabNavItem.svelte';
	import LiveCard, { isPlaying } from '$lib/components/LiveCard';
	import Carousel from '$lib/components/Carousel';
	import Metatags from '$lib/components/Metatags';
	import { generalNotifications } from '$lib/stores/notifications';
	import { scrollTop } from '$lib/functions/scrolling';

	export let data:PageData;
	const { categories, bannerImages } = data;

	let intervalId:number = -1;
	let scroll:InfiniteScroll;
	let atTop:boolean = true;
	let articleElement:HTMLElement;

	let currentIndex = 0;
	let distributions:Array<any> = [];
	let populars:Array<any> = [];
	let latests:Array<any> = [];
	let hasMore = true;

	$: sort = categories[currentIndex].path;

	$: if(atTop) {
		startInterval();
	} else {
		stopInterval();
	}

	afterNavigate(()=>{
		const s = $page.url.searchParams.get('s') ?? 'popular';
		currentIndex = categories.findIndex( c => c.path == s );
		currentIndex = currentIndex < 0 ? 0 : currentIndex;
	})

	onMount(() => {
		fetchNotifications();
	});

	onDestroy(() => {
		stopInterval();
	});

	function stopInterval() {
		browser && window.clearInterval(intervalId);
	}

	function startInterval() {
		if(!browser) {
			return;
		}
		stopInterval();
		intervalId = window.setInterval(() => {
			if( ! isPlaying() ){
				populars = [];
				latests = [];
				fetchDistributions();
			}
		}, 1000 * 60);
	}

	// 人気
	function fetchPopulars(refreshing = false) {
		return DistributionsApi.getApiV1DistributionsPopular({
				limit: 10,
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
		return DistributionsApi.getApiV1DistributionsLatest({
				limit: 10,
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

	function onScrollVP(e) {
		atTop = e.currentTarget.scrollTop < 150;
	}

	function onRefresh() {
		scrollTop(articleElement, {
			onComplete: () => {
				if( ! isPlaying() ){
					fetchDistributions(true);
				}
				startInterval();
			}
		});
	}

	function fetchNotifications() {
		NotificationsApi.getApiV1NotificationsGeneral({})
			.then(data => {
				if (!data) return;
				generalNotifications.set(data);
			})
			.catch(console.error);
	}
</script>

<Metatags />

<svelte:window on:refresh={ onRefresh } />

<article bind:this={ articleElement } on:scroll={onScrollVP} class="p-4 md:p-6 md:pr-8 w-full h-full overflow-y-scroll">
	<section class="max-w-md sm:max-w-lg md:max-w-9xl m-auto relative">
		<Carousel autoMode loop list={ bannerImages } gap={ 30 }></Carousel>
	</section>

	<div class="pt-4.5 pb-6 md:py-6">
		<Tabs on:select={() => fetchDistributions(true)} secondary bind:value={ currentIndex }>
			<TabNav
				spaceBetween={12}
				class="justify-center">
				{#each categories as item, index}
					<TabNavItem value={ index }>{ item.title }</TabNavItem>
				{/each}
			</TabNav>
		</Tabs>
	</div>

	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
		{#each distributions as distribution }
			<LiveCard
				onAir={distribution.status !== 'Completed'}
				streamUuid={distribution.uuid}
				distributorUuid={distribution.distributorUuid}
				title={distribution.title}
				thumbnailUrl={distribution.thumbnailUrl}
				userName={distribution.userName}
				userThumbnailUrl={distribution.userThumbnailUrl}
				viewersNum={distribution.status !== 'Completed' ? distribution.concurrentViewers : distribution.viewCount}
				startAt={distribution.actualStartAt}
				official={distribution.isOfficial}
				broadcastId={distribution.youTube.broadcastId}
				duration={distribution.durationSeconds}
				{sort}
				tags={distribution.tags}
				/>
		{/each}
		<InfiniteScroll
			active={ hasMore }
			bind:this={ scroll }
			on:more={ () => fetchDistributions() }
		/>
	</section>
</article>
