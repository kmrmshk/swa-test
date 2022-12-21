<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import Avatar from '$lib/components/Avatar';
	import { derived } from 'svelte/store';
	import { toApproxNumber } from '$lib/functions/util';
	import { smaller } from '$lib/stores/breakpoint';
	import type { FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic } from '$lib/apis';

	let userUuid:string;
	let userData:FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic;

	let name = '';
	let thumbnail = '';
	let channelId = '';
	let formattedSubscriberCount = '';
	let hasSubscriber = true;

	let small = derived([smaller('sm'), smaller('md', true)], ([h, v]) => h || v);

	$: ({ userUuid, userData } = $page.data);
	$: if(userData) updateUser(userData);
	$: subpages = [
		{
			title: '動画',
			href: `/users/${ userUuid }`,
			path: '/(framed)/users/[userUuid]'
		},
		{
			title: 'サポートランキング',
			href: `/users/${ userUuid }/item-rankings`,
			path: '/(framed)/users/[userUuid]/item-rankings'
		},
	];

	function updateUser(data:FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic) {
		name = data.youTubeChannelTitle ?? '';
		thumbnail = data?.thumbnailUrl ?? '';
		channelId = data.youTubeChannelId ?? '';
		hasSubscriber = !!data.subscriberCount;
		formattedSubscriberCount = hasSubscriber ? toApproxNumber(data.subscriberCount ?? 0, '人') : 'YouTubeチャンネルへ';
	}
</script>

<div class="flex flex-col absolute top-0 bottom-0 w-full">
	<header class="flex-shrink-0 bg-white dark:bg-gray-800">
		<div class="flex items-start px-6 pt-6 pb-4">
			<Avatar thumbnail={ thumbnail } rounded="2.5xl" class="flex-grow-0 flex-shrink-0 w-12 h-12 sm:vmd:(w-20 h-20)" size={false} />
			<div class="mx-4 flex-grow">
				<h4 class="text-base sm:vmd:(text-2xl mt-3) text-left line-clamp-2">{ name }</h4>
				<a href="https://www.youtube.com/channel/{ channelId }" target="_blank" class="mt-1 inline-flex items-center hover:(opacity-87)">
					{#if hasSubscriber}
						<i class="icon fingger-human-human text-lg md:text-xl text-base-dark dark:text-base-light"></i>
						<span class="ml-1 text-xs md:text-sm text-base-dark text-opacity-60 dark:(text-base-light text-opacity-60)">YouTube登録者数 { formattedSubscriberCount }</span>
					{:else}
						<span class="text-xs md:text-sm text-base-dark text-opacity-60 dark:(text-base-light text-opacity-60)">{ formattedSubscriberCount }</span>
						<i class="ml-1 icon fingger-launch text-lg md:text-xl text-base-dark dark:text-base-light"></i>
					{/if}
				</a>
			</div>
		</div>
		<Tabs value={$page.route.id} class="md:(ml-6 max-w-800px)" swipe={$small}>
			<TabNav>
				{#each subpages as item }
					<TabNavItem
						shrink
						value={ item.path }
						on:click={ () => goto(item.href) }
					>
						{item.title}
					</TabNavItem>
				{/each}
			</TabNav>
		</Tabs>
	</header>
	<section class="relative flex-grow overflow-hidden h-10">
		<div class="absolute inset-0 overflow-y-auto">
			<slot />
		</div>
	</section>
</div>
