<script lang="ts">
	import { page } from '$app/stores';
	import { searchWords, users } from '$lib/stores/search';
	import { SearchApi } from '$lib/apis';
	import Button from '$lib/components/Button';
	import SearchResultUserCard from '$lib/components/SearchResult';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import { strLength } from '$lib/functions/util';

	const { categoryUsers } = $page.data;
	const limit = 10;
	const maxlength = 256;

	let promise = Promise.resolve();
	let scroll:InfiniteScroll;

	function requestSearchByQuery() {
		if( strLength($searchWords) > maxlength ){
			return;
		}
		return SearchApi.getApiV1Search({
			searchWord: $searchWords,
			searchType: categoryUsers.type,
			limit: limit,
			offset: $users.length
		})
			.then(data => {
				if (data.users?.length) {
					$users = $users.concat(data.users);
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
		<h2 class="text-base md:text-2xl">ユーザー</h2>
		<Button text class="invisible">もっと見る</Button>
	</div>
	<!-- 検索結果が空の場合 -->
	{#if !$users.length}
		<div class="w-full py-6 md:py-66px text-center">
			<span class="fi-text-sub text-base md:text-xl">検索結果がありません</span>
		</div>
		<InfiniteScroll
			bind:this={ scroll }
			on:more={ () => addToPromise(requestSearchByQuery) }
		/>
	{:else}
		<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
			{#each $users as item (item.uuid) }
				<SearchResultUserCard uuid={item.uuid} thumbnailUrl={item.thumbnailUrl} name={item.youTubeChannelTitle} />
			{/each}
			<InfiniteScroll
				bind:this={ scroll }
				on:more={ () => addToPromise(requestSearchByQuery) }
			/>
		</section>
	{/if}
</div>
