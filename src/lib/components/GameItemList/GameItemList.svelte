<script lang="ts">
	import get from 'lodash/get';
	import { tick } from 'svelte';
	import { UsersApi } from '$lib/apis';
	import { prepared } from '$lib/stores/user';
	import Carousel from '$lib/components/Carousel';
	import GameItemCard from './GameItemCard.svelte';

	export let bundleId:string;
	export let breakpoints = {};
	export let slidesPerColumn = 1;
	export let asCarousel = true;

	let aggregatedItem = [];
	let carousel = null;

	$: if (bundleId && $prepared) {
		fetchItems();
	}

	function fetchItems() {
		return UsersApi.getApiV1UsersMeItemsAggregate({ bundleId })
			.then(data =>  {
				if (!data) {
					return [];
				}
				aggregatedItem = get(data, '0.items', []);
			})
			.then(async _ => {
				await tick();
				carousel?.refresh();
			})
			.catch(console.error);
	}
</script>

<svelte:window on:gameitem-update={ fetchItems } />

{#if ! aggregatedItem.length }
	<div class="pt-8 md:pt-20 text-center font-bold text-sm md:text-xl fi-text-sub">
		アイテムはありません
	</div>
{:else if asCarousel }
	<Carousel
		bind:this={ carousel }
		list={ aggregatedItem }
		{breakpoints}
		{slidesPerColumn}
		useDummy={ true }
		useGridStyle={ true }
	>
		<div slot="slide" let:item let:index class="px-2 pb-4 h-full">
			<GameItemCard
					thumbnail={ item?.thumbnailUrl }
					name={ item?.name }
					description={ item?.description }
					amount={ item?.amount }
					asEmpty={ !item }
				/>
		</div>
	</Carousel>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
		{#each aggregatedItem as item}
			<GameItemCard
				thumbnail={ item?.thumbnailUrl }
				name={ item?.name }
				description={ item?.description }
				amount={ item?.amount }
			/>
		{/each}
	</div>
{/if}