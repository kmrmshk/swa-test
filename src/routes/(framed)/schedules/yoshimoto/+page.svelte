<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { NotificationsApi } from '$lib/apis';
	import { larger } from '$lib/stores/breakpoint';
	import { generalNotifications, specificItemList } from '$lib/stores/notifications';
	import Loading from '$lib/components/Loading';
	import Pagination from '$lib/components/Pagination';
	import Metatags from '$lib/components/Metatags';
	import { scrollTop } from '$lib/functions/scrolling';
	import type { FinggerPlatform_Server_Shared_DataTransferObjects_Notification_GeneralNotificationPublic as GeneralNotification } from '$lib/apis';

	const large = larger('md');
	const typeName = 'よしもとfingger部配信のスケジュール';

	let container:HTMLElement;
	let isLoading = true;
	let index:number;
	let targets:Array<GeneralNotification> = [];
	let notification:GeneralNotification|null;

	afterNavigate( async () => {
		isLoading = true;
		if( ! $specificItemList.length ){
			$generalNotifications = await NotificationsApi.getApiV1NotificationsGeneral({}).catch(_ => null);
		}
		targets = $specificItemList.filter(item => item.type === typeName);
		const p = $page.url.searchParams.get('p') ?? '1';
		const pageNum = Math.max(1, Math.min(parseInt(p), targets.length));
		index = pageNum - 1;
		const uuid = targets[index]?.uuid;
		if( uuid ){
			notification = await NotificationsApi.getApiV1NotificationsGeneral1({ uuid }).catch(_ => null);
		}
		isLoading = false;
	});

	function onSelectIndex({detail}) {
		goto(`${ $page.url.pathname }?p=${ detail + 1 }`);
		if(container) {
			scrollTop(container, { duration: 0 });
		}
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="よしもとfingger部配信のスケジュール"
	description="よしもとfingger部配信のスケジュール"
/>

<article class="flex flex-col absolute top-0 bottom-0 w-full">
	<header class="bg-white dark:bg-gray-800 fi-border border-b py-4 px-6 leading-none text-xl md:(text-2xl py-5)">
		よしもとfingger部配信のスケジュール
	</header>
	<div bind:this={container} class="py-6 md:(pl-6 pr-8) relative flex-grow overflow-y-scroll">
		{#if isLoading}
			<div class="flex h-full items-center justify-center text-center font-bold text-sm md:text-xl fi-text-sub">
				<Loading light="#06A3B4" dark="#7ED9E2" size={32} />
			</div>
		{:else if notification?.body ?? ''}
			<div class="board bg-white dark:bg-gray-900 flex flex-col mx-auto fi-border border-t-1 md:(overflow-hidden rounded-lg border-1)">
				<div class="schedule flex-grow">
					{@html notification?.body}
				</div>
				<hr>
				<div class=" flex-shrink-0 flex py-1 justify-center">
					<Pagination
						on:select={ onSelectIndex }
						index={ index }
						radius={ $large ? 2 : 1 }
						total={ targets.length }
					/>
				</div>
			</div>
		{:else}
			<div class="flex h-full items-center justify-center text-center font-bold text-sm md:text-xl fi-text-sub">
				配信スケジュールはありません
			</div>
		{/if}
	</div>
</article>

<style lang="scss">
	.board {
		@apply max-w-800px;
	}
	.schedule {
		max-height: max-content;
	}
	.schedule :global(img){
		@apply w-full max-w-800px;
	}
</style>