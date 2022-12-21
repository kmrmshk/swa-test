<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { afterNavigate } from '$app/navigation';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import type { FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic as GamePublic } from '$lib/apis';
	import { toUrl } from '$lib/functions/util';

	const subpages = [
		{
			title: 'トップ',
			path: 'games/[bundleId]',
			pattern: /\(framed\)\/games\/\[bundleId\]\$/,
			selling: false
		},
		{
			title: 'お知らせ',
			path: 'games/[bundleId]/notifications',
			pattern: /\(framed\)\/games\/\[bundleId\]\/notifications\/?.*$/,
			selling: false
		},
		{
			title: 'イベント',
			path: 'games/[bundleId]/events',
			pattern: /\(framed\)\/games\/\[bundleId\]\/events\/?.*$/,
			selling: false
		},
		{
			title: 'ランキング',
			path: 'games/[bundleId]/rankings',
			pattern: /\(framed\)\/games\/\[bundleId\]\/rankings\/?.*$/,
			selling: false
		},
		{
			title: 'ガチャ',
			path: 'games/[bundleId]/gacha',
			pattern: /\(framed\)\/games\/\[bundleId\]\/gacha\/?.*$/,
			selling: true
		},
		{
			title: 'プレイデータ',
			path: 'games/[bundleId]/logs',
			pattern: /\(framed\)\/games\/\[bundleId\]\/logs\/?.*$/,
			selling: false
		},
	];

	let scrollContainer:HTMLElement;
	let bundleId:string;
	let bundleInfo:GamePublic;
	let hasProducts:boolean;

	$: ({ bundleId, bundleInfo, hasProducts } = $page.data)
	$: routeId = $page.route.id;

	afterNavigate(() => {
		scrollContainer.scrollTop = 0;
	});
</script>

<article class="flex flex-col absolute top-0 bottom-0 w-full">
	<div class="bg-white dark:bg-gray-800 fi-border border-b">
		<header class="flex items-center justify-start p-4 md:vmd:(px-6 h-22)">
			<span
				class="inline-block flex-shrink-0 w-8 h-8 md:vmd:(w-14 h-14) rounded-lg bg-center bg-cover"
				style="background-image: url({ bundleInfo?.iconImageUrl })"></span>
			<h4 class="ml-2 text-xl md:vmd:(ml-4 text-2xl) line-clamp-1">{ bundleInfo.title || ''}</h4>
		</header>
		<div class="px-4">
			<Tabs bind:value={ routeId } swipe>
				<TabNav centered >
					{#key routeId}
						{#each subpages as item}
							{#if !item.selling || hasProducts }
								<TabNavItem path={item.pattern} on:click={() => goto(toUrl(item.path, {bundleId}))}>
									{ item.title }
								</TabNavItem>
							{/if}
						{/each}
					{/key}
				</TabNav>
			</Tabs>
		</div>
	</div>
	<section class="relative flex-grow overflow-hidden h-10">
		<div bind:this={scrollContainer} class="absolute inset-0 overflow-y-auto">
			<slot/>
		</div>
	</section>
</article>
