<script lang="ts">
	import { page } from '$app/stores';
	import debounce from 'lodash/debounce';
	import { searchWords, users, lives, archives } from '$lib/stores/search';
	import { SearchApi } from '$lib/apis';
	import LiveCard from '$lib/components/LiveCard';
	import Button from '$lib/components/Button';
	import SearchResultUserCard from '$lib/components/SearchResult';
	import { encodeURI, strLength } from '$lib/functions/util';

	const { categoryAll, categoryUsers, categoryLives, categoryArchives } = $page.data;

	const seeMoreUsersNum = 3;
	const seeMoreLivesNum = 6;
	const seeMoreArchivesNum = 6;
	const limitNums = 7;
	const maxlength = 256;

	const requestSearchByQuery = debounce(_requestSearchByQuery, 100, {leading: false});
	function _requestSearchByQuery() {
		if( strLength($searchWords) > maxlength ){
			return;
		}
		return SearchApi
			.getApiV1Search({
				searchWord: $searchWords,
				searchType: categoryAll.type,
				limit: limitNums,
				offset: 0
			})
			.then(data => {
				$users = data.users;
				$lives = data.liveDistributionDetails;
				$archives = data.completedDistributionLiveDetails;
			})
			.catch(console.error);
	}

	$: if ($searchWords) {
		requestSearchByQuery();
	}

	$: searchWordsURI = encodeURI($searchWords);
</script>

<div class="p-4 py-3 md:(p-6 pr-8)">
	<div class="flex items-center justify-between mb-2 md:mb-4">
		<h2 class="text-base md:text-2xl">ユーザー</h2>
		<Button text to={ `${categoryUsers.href}/?q=${ searchWordsURI }` } disabled={$users.length <= seeMoreUsersNum}>
			もっと見る
		</Button>
	</div>
	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
		{#each $users.slice(0, seeMoreUsersNum) as item (item.uuid) }
			<SearchResultUserCard uuid={item.uuid} thumbnailUrl={item.thumbnailUrl} name={item.youTubeChannelTitle} />
		{/each}
	</section>

	<!-- 検索結果が空の場合 -->
	{#if !$users.length}
		<div class="w-full py-6 md:py-66px text-center">
			<span class="fi-text-sub text-base md:text-xl">検索結果がありません</span>
		</div>
	{/if}
</div>

<div class="p-4 py-3 md:(p-6 pr-8)">
	<div class="flex items-center justify-between mb-2 md:mb-4">
		<h2 class="text-base md:text-2xl">ライブ</h2>
		<Button text to={ `${categoryLives.href}/?q=${ searchWordsURI }` } disabled={$lives.length <= seeMoreLivesNum}>
			もっと見る
		</Button>
	</div>
	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
		{#each $lives.slice(0, seeMoreLivesNum) as item (item.uuid) }
			<LiveCard
				onAir={item.status !== 'Completed'}
				streamUuid={item.uuid}
				distributorUuid="{item.distributorUuid}"
				title="{item.title}"
				thumbnailUrl="{item.thumbnailUrl}"
				userName="{item.userName}"
				userThumbnailUrl="{item.userThumbnailUrl}"
				viewersNum="{item.status !== 'Completed' ? item.concurrentViewers : item.viewCount}"
				startAt="{item.actualStartAt}"
				official={item.isOfficial}
				duration={item.durationSeconds}
				tags={item.tags}
			/>
		{/each}
	</section>

	<!-- 検索結果が空の場合 -->
	{#if !$lives.length}
		<div class="w-full py-6 md:py-66px text-center">
			<span class="fi-text-sub text-base md:text-xl">検索結果がありません</span>
		</div>
	{/if}
</div>

<div class="p-4 py-3 md:(p-6 pr-8)">
	<div class="flex items-center justify-between mb-2 md:mb-4">
		<h2 class="text-base md:text-2xl">アーカイブ</h2>
		<Button text to={ `${categoryArchives.href}/?q=${ searchWordsURI }` } disabled={$archives.length <= seeMoreArchivesNum}>
			もっと見る
		</Button>
	</div>
	<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7 6xl:grid-cols-8 gap-4">
		{#each $archives.slice(0, seeMoreArchivesNum) as item (item.uuid) }
			<LiveCard
				onAir={item.status !== 'Completed'}
				streamUuid={item.uuid}
				distributorUuid="{item.distributorUuid}"
				title="{item.title}"
				thumbnailUrl="{item.thumbnailUrl}"
				userName="{item.userName}"
				userThumbnailUrl="{item.userThumbnailUrl}"
				viewersNum="{item.status !== 'Completed' ? item.concurrentViewers : item.viewCount}"
				startAt="{item.actualStartAt}"
				official={item.isOfficial}
				duration={item.durationSeconds}
				tags={item.tags}
			/>
		{/each}
	</section>

	<!-- 検索結果が空の場合 -->
	{#if !$archives.length}
		<div class="w-full py-6 md:py-66px text-center">
			<span class="fi-text-sub text-base md:text-xl">検索結果がありません</span>
		</div>
	{/if}
</div>
