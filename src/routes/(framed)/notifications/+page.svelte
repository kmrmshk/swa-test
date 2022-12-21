<script lang="ts">
	import get from 'lodash/get';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { larger } from '$lib/stores/breakpoint';
	import { scrollTop } from '$lib/functions/scrolling';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import Badge from '$lib/components/Badge';
	import { NoticeItem } from '$lib/components/Notification';
	import { dark } from '$lib/stores/theme';
	import { generalNewsList, userNotifications, publicPageNum, readGeneralNotifications } from '$lib/stores/notifications';
	import chunk from 'lodash/chunk';
	import some from 'lodash/some';
	import Metatags from '$lib/components/Metatags';
	import Pagination from '$lib/components/Pagination';
	import parseISO from 'date-fns/parseISO/index.js';

	const large = larger('md');
	const length = 10;
	let index = 0;
	let container:HTMLElement;

	function paramsToPageNum(url:URL) {
		const page = url.searchParams.get('p') ?? '1';
		$publicPageNum = Math.max(1, parseInt(page));
		index = $publicPageNum - 1;
	}

	function onSelectIndex({detail}) {
		const index = detail + 1;
		$publicPageNum = index;
		goto(`${ $page.url.pathname }/?p=${ index }`);
		if(container) {
			scrollTop(container, { duration: 0 });
		}
	}

	$: items = chunk($generalNewsList, length);
	$: hasBadge = some($userNotifications.notifications, (item) => item.hasBadge);
	$: paramsToPageNum($page.url);

	$: if( get($generalNewsList,'0.publishedAt') ){
		readGeneralNotifications.set( parseISO($generalNewsList[0].publishedAt).getTime() );
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="お知らせ"
	description="お知らせ"
/>

<div class="fi-border flex justify-center bg-white dark:bg-gray-800 border-b-1">
	<Tabs value="all" useSwiper>
		<TabNav class="justify-center">
			<TabNavItem value="all" on:click={ () => goto('/notifications') }>
				全体
			</TabNavItem>
			<TabNavItem value="inbox" path="/notifications/inbox" on:click={ () => goto('/notifications/inbox') }>
				あなた宛
				{#if hasBadge}
					<Badge top right></Badge>
				{/if}
			</TabNavItem>
		</TabNav>
	</Tabs>
</div>

<article bind:this={ container } class="notifications absolute top-12 bottom-0 left-0 right-0 overflow-y-auto" class:dark={ $dark }>
	<div class="relative mt-5 mx-auto md:max-w-2xl xl:max-w-3xl">
		<h2 class="fi-text-sub flex items-center h-6 mb-3 pl-4 text-sm md:(pl-0 text-xl) font-bold">
			お知らせ一覧
		</h2>
		<ul class="w-full mx-auto round bg-white dark:bg-gray-900 mb-7 border-t-1 md:(overflow-hidden rounded-lg border-1)">
			{#if !items.length}
				<li class="p-4">
					<span class="fi-text-sub text-sm">
						お知らせはありません
					</span>
				</li>
			{:else}
				{#each items[index] as item}
					<NoticeItem
						unread={ item.hasBadge }
						to={ `/notifications/${ item.uuid }` }
						title={ item.title }
						overview={ item.type }
						datetime={ item.date }
					/>
				{/each}
				<hr>
				<div class="flex py-1 justify-center">
					<Pagination
						on:select={ onSelectIndex }
						bind:index={ index }
						radius={ $large ? 2 : 1 }
						total={ items.length }
					/>
				</div>
			{/if}
		</ul>
	</div>
</article>