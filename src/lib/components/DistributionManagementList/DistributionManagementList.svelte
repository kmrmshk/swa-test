<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { larger } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import { Accordion, AccordionItem } from '$lib/components/Accordion';
	import Button from '$lib/components/Button';
	import { OfficialChip } from '$lib/components/LiveCard';
	import { goto } from '$app/navigation';

	export let isStream = true;
	export let distributions=[];

	const large = larger('md');
	const dispatch = createEventDispatcher();
	const assetBase = `${ import.meta.env.asset_endpoint }`;

	function onClickedDeleteButton(uuid){
		dispatch('click-delete',{
			uuid : uuid
		});
	}

	function onClickedEditButton(uuid){
		dispatch('click-edit',{
			uuid : uuid
		});
	}

	function onClickedDistribution(uuid){
		if(isStream){
			goto(`/streams/${ uuid }`);
		}
		else{
			goto(`/archives/${ uuid }`);
		}
	}

	function getThumbnail({thumbnailUrl}, theme){
		return thumbnailUrl ? thumbnailUrl : `/assets/images/thumbs/default${ theme ? '@dark' : '' }.png`;
	}
</script>

{#if $large}
	{#each distributions as distribution (distribution.uuid)}
		<li class="distributions-table" class:selected={ false } >
			<div class="table-cell border-base-dark dark:border-base-light text-left pl-8 py-6">
				<div class="relative aspect-w-16 aspect-h-9">
					<div class="absolute inset-0 overflow-hidden rounded-xl bg-base-light border-none">
						<div
							on:click={()=>onClickedDistribution(distribution.uuid)}
							class="w-full h-full bg-center bg-cover cursor-pointer transition-all origin-center transition transform hover:(scale-110 opacity-80 bg-blend-overlay duration-3000)"
							style="{`background-image: url(${ getThumbnail(distribution, $dark) });`}"></div>
						{#if distribution.isOfficial}
							<OfficialChip minimum class="absolute m-1.5 right-0 top-0" />
						{/if}
					</div>
				</div>
			</div>
			<div class="table-cell border-base-dark dark:border-base-light text-left pl-4 pt-6 align-top">
				<div
					on:click={()=>onClickedDistribution(distribution.uuid)}
					class="text-base cursor-pointer fi-anchor max-h-12 line-clamp-2">
					{distribution.title}
				</div>
				<div class="pb-6 max-h-10 line-clamp-2">{distribution.description}</div>
			</div>
			<div class="table-cell border-base-dark dark:border-base-light text-left pl-4 align-middle">{distribution.date}</div>
			<div class="table-cell border-base-dark dark:border-base-light text-right pr-8 align-middle">
				<Button on:click={()=>onClickedEditButton(distribution.uuid)} small text outlined>編集</Button>
			</div>
			{#if ! isStream}
				<div class="table-cell border-base-dark dark:border-base-light text-right pr-8 align-middle">
					<Button on:click={()=>onClickedDeleteButton(distribution.uuid)} small text outlined>削除</Button>
				</div>
			{/if}
		</li>
	{/each}
{:else}
	<Accordion>
	{#each distributions as distribution (distribution.uuid)}
		<AccordionItem let:expanded class="text-sm">
			<!-- title -->
			<li slot="title" class="distributions-accordion border-t-1 pl-6 pr-4" class:selected={ expanded } >
				<div class="flex py-2">
					<div class="min-w-34">
						<div class="relative aspect-w-16 aspect-h-9">
							<div class="absolute inset-0 overflow-hidden rounded-xl">
								<div
									on:click={()=>onClickedDistribution(distribution.uuid)}
									class="w-full h-full bg-center bg-cover cursor-pointer transform hover:(scale-110 opacity-80 bg-blend-overlay duration-3000)"
									style="{`background-image: url(${ getThumbnail(distribution, $dark) });`}"></div>
								{#if distribution.isOfficial}
									<OfficialChip minimum class="absolute m-1.5 right-0 top-0" />
								{/if}
							</div>
						</div>
					</div>
					<div class="pl-2">
						<div
							on:click={()=>onClickedDistribution(distribution.uuid)}
							class="text-base cursor-pointer fi-anchor max-h-12 line-clamp-2">
							{distribution.title}
						</div>
						<div class="max-h-10 line-clamp-2">{distribution.description}</div>
					</div>
				</div>
			</li>
			<!-- contents -->
			<hr class="border-t-1 border-base-dark border-opacity-10" />
			<div class="pl-8">
				<div class="flex justify-between items-center pr-4 h-12">
					<span class="fi-text-sub text-xs flex-shrink-0">
						配信開始時刻
					</span>
					<span>{distribution.date}</span>
				</div>
				<hr class="border-t-1 border-base-dark border-opacity-10" />
				<div class="flex justify-between items-center pr-4 h-12">
						<span class="fi-text-sub text-xs flex-shrink-0">設定変更</span>
						<Button on:click={()=>onClickedEditButton(distribution.uuid)} text outlined>編集</Button>
				</div>
				{#if ! isStream}
					<hr class="border-t-1 border-base-dark border-opacity-10" />
					<div class="flex justify-between items-center pr-4 h-12">
						<span class="fi-text-sub text-xs flex-shrink-0">動画削除</span>
						<Button on:click={()=>onClickedDeleteButton(distribution.uuid)} text outlined>削除</Button>
					</div>
				{/if}
			</div>
		</AccordionItem>
	{/each}
	</Accordion>
{/if}


<style>
	.distributions-table {
			@apply h-13 text-sm border-t-1 table-row border-b-gray-500;
	}
	.distributions-table > .table-cell {
			@apply border-t-1 border-opacity-10 text-sm;
	}
	.distributions-accordion.selected {
			@apply bg-teal-600 bg-opacity-8 transition duration-150;
	}
</style>
