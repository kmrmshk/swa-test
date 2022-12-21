<script lang="ts">
	import { page } from '$app/stores';
	import { GamesApi } from '$lib/apis';
	import Metatags from '$lib/components/Metatags';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import Image from '$lib/components/Image';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Game_GamePublic as GamePublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameEventPublic as GameEvent
	} from '$lib/apis';
	import Card from '$lib/components/Card';

	let bundleInfo:GamePublic = $page.data.bundleInfo;
	let events:Array<GameEvent> = [];
	let currentIndex = 0;

	$: event = events[currentIndex] ?? {};
	$: informations = event?.informations ?? [];

	$: if(bundleInfo?.bundleId){
		fetchEvents();
	}

	function fetchEvents() {
		return GamesApi
			.getApiV1GamesEvents({
				bundleId: bundleInfo?.bundleId
			})
			.then(data => {
				events = data ?? [];
			})
			.catch(console.error);
	}

</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ bundleInfo?.title } | イベント"
	description="{ bundleInfo?.title } | イベント"
/>

{#if events.length}
	<section class="px-4 md:px-6 py-4 m-auto">
		<div class="pb-4 md:pb-7">
			<Tabs bind:value={ currentIndex } secondary swipe>
				<TabNav spaceBetween={12} centered class="justify-center">
					{#each events as event, index}
						<TabNavItem value={ index } class="w-44 px-13px">
							<span class="block whitespace-nowrap overflow-hidden overflow-ellipsis">{ event.title }</span>
						</TabNavItem>
					{/each}
				</TabNav>
			</Tabs>
		</div>
		<div class="max-w-712px m-auto">
			{#key currentIndex}
				<Image lazy
					width="712px"
					src={ event.imageUrl ?? '' }
				/>
			{/key}
			{#each informations as item}
				<div class="event-card pt-8 <md:(text-sm pt-4)">
					{#if item.title}
						<h5 class="pb-1 md:(pb-2 text-xl) font-bold fi-text-sub"><slot name="title" /></h5>
					{/if}
					<Card class="h-full px-3 py-2 md:(px-6 py-5) fi-border bg-white dark:bg-gray-900 border-1 rounded-lg">
						<div class="fi-article fi-text">{@html item.body}</div>
					</Card>
				</div>
			{/each}
		</div>
	</section>
{:else}
	<div class="pt-8 md:pt-20 text-center font-bold text-sm md:text-xl fi-text-sub">
		イベントは開催されておりません
	</div>
{/if}

<style lang="scss">
	.event-card :global(a){
		@apply text-primary-light;
	}
	:global(.dark) .event-card :global(a) {
		@apply text-primary-dark;
	}
</style>