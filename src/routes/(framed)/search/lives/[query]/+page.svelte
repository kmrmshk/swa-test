<script lang="ts">
	import { page } from '$app/stores';
	import { searchWords, lives } from '$lib/stores/search';
	import { SearchApi } from '$lib/apis';
	import LiveCard from '$lib/components/LiveCard';
	import Button from '$lib/components/Button';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import { strLength } from '$lib/functions/util';

	const { categoryLives } = $page.data;
	const limit = 20;
	const maxlength = 256;

	let promise = Promise.resolve();
	let scroll:InfiniteScroll;

	function requestSearchByQuery() {
		if( strLength($searchWords) > maxlength ){
			return;
		}
		return SearchApi.getApiV1Search({
			searchWord: $searchWords,
			searchType: categoryLives.type,
			limit: limit,
			offset: $lives.length
		})
			.then(data => {
				if (data.liveDistributionDetails.length) {
					$lives = $lives.concat(data.liveDistributionDetails);
					scroll?.validate();
				}
			})
			.catch(console.error);
	}

	function addToPromise(f) {
		promise = promise.then(() => f());
	}
</script>

<div class="p-4 py-3 md:(p-6 pr-8)">
	<div class="flex items-center justify-between mb-2 md:mb-4">
		<h2 class="text-base md:text-2xl">ライブ</h2>
		<Button text class="invisible">もっと見る</Button>
	</div>
	<!-- 検索結果が空の場合 -->
	{#if !$lives.length}
		<div class="w-full py-6 md:py-66px text-center">
			<span class="fi-text-sub text-base md:text-xl">検索結果がありません</span>
		</div>
		<InfiniteScroll
			bind:this={ scroll }
			on:more={ () => addToPromise(requestSearchByQuery) }
		/>
	{:else}
		<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
			{#each $lives as item (item.uuid) }
				<LiveCard
					onAir={item.status !== 'Completed'}
					streamUuid={item.uuid}
					distributorUuid={item.distributorUuid}
					title={item.title}
					thumbnailUrl={item.thumbnailUrl}
					userName={item.userName}
					userThumbnailUrl={item.userThumbnailUrl}
					viewersNum={item.status !== 'Completed' ? item.concurrentViewers : item.viewCount}
					startAt={item.actualStartAt}
					official={item.isOfficial}
					duration={item.durationSeconds}
					tags={item.tags}
				/>
			{/each}
			<InfiniteScroll
				bind:this={ scroll }
				on:more={ () => addToPromise(requestSearchByQuery) }
			/>
		</section>
	{/if}
</div>
