<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { larger } from '$lib/stores/breakpoint';
	import { scrollTop } from '$lib/functions/scrolling';
	import { goto } from '$app/navigation';
	import isEmpty from 'lodash/isEmpty';
	import chunk from 'lodash/chunk';
	import some from 'lodash/some';
	import get from 'lodash/get';
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import { dark } from '$lib/stores/theme';
	import { NoticeItem } from '$lib/components/Notification';
	import Metatags from '$lib/components/Metatags';
	import Pagination from '$lib/components/Pagination';
	import { GamesApi } from '$lib/apis';
	// NOTE: お知らせ画面と共用
	import { publicPageNum } from '$lib/stores/notifications';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Notification_Base_NotificationBasePublic as Notification
	} from '$lib/apis';

	const length = 10;
	const large = larger('md');

	export let data:PageData;
	let bundleInfo = data.bundleInfo;
	let index = 0;
	let container:HTMLElement;
	let notifications:Array<Notification> = [];

	function paramsToPageNum(url:URL) {
		const page = url.searchParams.get('p') ?? '1';
		$publicPageNum = Math.max(1, parseInt(page));
		index = $publicPageNum - 1;
	}

	function onSelectIndex({detail}) {
		const index = detail + 1;
		const parent = container?.parentNode;
		$publicPageNum = index
		goto(`${ $page.url.pathname }/?p=${ index }`);
		if(parent) {
			scrollTop(parent, { duration: 0 });
		}
	}

	function fetchNotification() {
		return GamesApi
			.getApiV1GamesNotifications1({
				bundleId: bundleInfo?.bundleId
			})
			.then(data => {
				notifications = get(data, 'notifications', []);
			})
			.catch(console.error);
	}

	$: items = chunk(notifications, length);
	$: hasBadge = some(notifications, (item) => item.hasBadge);
	$: if(!isEmpty(bundleInfo)) {
		fetchNotification();
	}
	// FIXME: Sveltekitの実装に置き換える
	$: paramsToPageNum($page.url);
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ bundleInfo?.title } | お知らせ"
	description="{ bundleInfo?.title } | お知らせ"
/>

<article bind:this={ container } class="notifications" class:dark={ $dark }>
	<div class="relative mt-5 mx-auto md:max-w-2xl xl:max-w-3xl">
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
						unread={ false }
						to={ `./notifications/${ item.uuid }` }
						title={ item.title }
						overview={ item.type }
						datetime={ format(parseISO(item.publishedAt), 'yyyy/MM/dd HH:mm') }
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

<style lang="scss">
    :global(.notifications li + li::before) {
        content: '';
		// FIXME: @apply は li 要素に直接 class に入れるようにする
        @apply block absolute top-0 right-0 left-11 md:left-13 h-1px bg-base-dark bg-opacity-10;
    }
    :global(.notifications.dark li + li::before) {
		// FIXME: @apply は li 要素に直接 class に入れるようにする
	    @apply bg-white bg-opacity-12;
    }
</style>