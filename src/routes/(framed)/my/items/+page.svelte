<script lang="ts">
	import Card from '$lib/components/Card';
	import { UsersApi } from '$lib/apis';
	import { channel, prepared } from '$lib/stores/user';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import Metatags from '$lib/components/Metatags';
	import { GameItemCard } from '$lib/components/GameItemList';

	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Item_AggregatedItemListPublic as ItemList
	} from '$lib/apis';

	let aggregatedItems:Array<ItemList> = [];
	let scroll:InfiniteScroll;
	let promise = Promise.resolve();

	function addToPromise(f) {
		promise = promise.then(() => f()).catch(console.warn);
	}

	function fetchItems() {
		return UsersApi.getApiV1UsersMeItemsAggregate({
			bundleId: undefined,
			limit: 10,
			offset: aggregatedItems.length
		})
			.then(data =>  {
				if (!data) {
					return [];
				}
				if (data.length) {
					aggregatedItems = aggregatedItems.concat(data);
					scroll?.validate();
				}
			})
			.catch(console.error);
	}
</script>

<Metatags
	useSuffix
	title="{$channel.title} / アイテム"
/>

<div class="px-4 md:(px-6 pb-6)">
	{#each aggregatedItems as aggregatedItem}
		<Card
			class="<md:hidden fi-border relative mt-8 border-1 bg-white bg-no-repeat dark:bg-gray-900 shadow-02dp w-full h-20 text-2xl bg-contain bg-left-top"
			style="{`background-image: url(${ aggregatedItem.game?.bannerImageUrl });`}"
		>
			<h2 class="absolute top-3 left-65">{aggregatedItem.game?.title}</h2>
		</Card>
		<h2 class="md:hidden mt-3 md:mt-7 text-base">{aggregatedItem.game?.title}</h2>

		<div class="mt-2 md:mt-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
			{#each (aggregatedItem.items ?? []) as item}
				<GameItemCard
					thumbnail={ item.thumbnailUrl ?? '' }
					name={ item.name ?? '' }
					description={ item.description ?? '' }
					amount={ item.amount }
				/>
			{/each}
		</div>
	{:else}
		<div class="pt-10 md:pt-20 text-center font-bold text-base md:text-lg fi-text-sub">
			アイテムはありません
		</div>
	{/each}
</div>
<InfiniteScroll
	active={ $prepared }
	bind:this={ scroll }
	on:more={ () => addToPromise(fetchItems) }
/>