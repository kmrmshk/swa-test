<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		TagsApi,
		type FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic as TagPublic,
		type FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetail
	} from '$lib/apis';
	import { onDestroy } from 'svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import LiveCard,{ isPlaying } from '$lib/components/LiveCard';
	import Tag from '$lib/components/Tag';
	import Metatags from '$lib/components/Metatags';
	import { scrollTop } from '$lib/functions/scrolling';
	import { encodeURI, decodeURI } from '$lib/functions/util';

	export let data:PageData;
	const { categories } = data;
	const defalutSort = categories[0].path;
	const limit = 1000;
	const maxTagLength = 2;

	let tags:Array<TagPublic> = [];
	let sort = defalutSort;
	let intervalId = -1;
	let scroll:InfiniteScroll;
	let atTop = true;
	let distributions:Array<DistributionDetail> = [];
	let articleElement:HTMLElement;
	let allTags:Array<TagPublic> = [];
	let hasMore = true;

	$: if(atTop) {
		startInterval();
	} else {
		stopInterval();
	}

	afterNavigate(() => {
		const s = $page.url.searchParams.get('s') ?? '';
		sort = categories.some( c => c.path == s ) ? s : defalutSort;
		scrollTop(articleElement);
		paramToTags();
	})

	onDestroy(() => {
		stopInterval();
	});

	async function paramToTags(){
		allTags = await TagsApi.getApiV1Tags1({
			limit,
			offset: 0
		});
		const names = $page.params?.items.split('/');
		tags = names.map( str => {
				const name = decodeURI(str);
				return allTags.find( tag => tag.name == name );
			})
			.filter( tag => tag != undefined );

		tags = Array.from(new Set(tags))
			.splice( 0, maxTagLength );

		if( tags.length == 0 ){
			goto(`/s=${sort}`);
			return;
		}

		fetchDistributions(true);
	}

	function startInterval() {
		if(!browser) return;
		stopInterval();
		intervalId = window.setInterval(() => {
			if( ! isPlaying() ){
				fetchDistributions(true);
			}
		}, 1000 * 60);
	}

	function stopInterval() {
		if(!browser) return;
		window.clearInterval(intervalId);
	}

	const fetchDistributions = (refreshing = false) => {
		let fetchApi;
		if (tags.length == 0){
			return Promise.resolve();
		}
		const tagIds = tags.map( tag => tag.id ?? '' );

		if( sort == defalutSort ){
			// 人気
			fetchApi = TagsApi.getApiV1TagsDistributionsPopular({
				originTagIds: tagIds,
				limit: 10,
				offset: refreshing ? 0 : distributions.length
			});
		}
		else{
			// 最新
			fetchApi = TagsApi.getApiV1TagsDistributionsLatest({
				originTagIds: tagIds,
				limit: 10,
				offset: refreshing ? 0 : distributions.length
			});
		}
		return fetchApi.then(async data => {
			hasMore = (data?.length ?? 0) > 0;
			if(refreshing){
				distributions = data;
			}
			else if(hasMore){
				distributions.push(...data);
				distributions = distributions;
			}
			if(hasMore) {
				scroll?.validate();
			}
		});
	}

	function onSelectedTab() {
		if( ! tags.length || $page.url.searchParams.get('s') == sort ){
			return;
		}
		const name1 = encodeURI(tags[0].name);
		if(tags.length == 1){
			goto(`/tags/${name1}?s=${sort}`);
		}
		else{
			const name2 = encodeURI(tags[1].name);
			goto(`/tags/${name1}/${name2}?s=${sort}`);
		}
	}

	function onScrollVP(e) {
		atTop = e.currentTarget.scrollTop < 150;
	}

	function onClickedSelectedTag(id){
		if(tags.length == 1){
			goto(`/?s=${sort}`);
		}
		else if(tags[0].id == id){
			const name1 = encodeURI(tags[1].name);
			goto(`/tags/${name1}?s=${sort}`);
		}
		else if(tags[1].id == id){
			const name1 = encodeURI(tags[0].name);
			goto(`/tags/${name1}?s=${sort}`);
		}
	}
</script>

<Metatags />
<article class="flex flex-col absolute top-0 bottom-0 w-full">
	<header class="bg-white dark:bg-gray-800 fi-border border-b py-4 px-6">
		{#each tags as tag}
			<Tag on:click={()=>onClickedSelectedTag(tag.id)} mode="search" closeable class="mr-2 cursor-pointer">{tag.name}</Tag>
		{/each}
	</header>
	<div bind:this={ articleElement } on:scroll={onScrollVP} class="pt-6 px-4 md:pr-8 relative flex-grow overflow-hidden h-10 overflow-y-scroll">
		<div class="pb-6">
			<Tabs on:select={onSelectedTab} secondary bind:value={ sort }>
				<TabNav
					spaceBetween={12}
					class="justify-center">
					{#each categories as item}
						<TabNavItem value={ item.path }>{ item.title }</TabNavItem>
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
					selectedTags={tags}
					/>
			{/each}
			<InfiniteScroll
				active={ hasMore }
				bind:this={ scroll }
				on:more={ () => fetchDistributions() }
			/>
		</section>
	</div>
</article>
