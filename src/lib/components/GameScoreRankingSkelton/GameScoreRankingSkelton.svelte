<script lang="ts">
	import { smaller } from '$lib/stores/breakpoint';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import GameScoreRankingListTitle from './GameScoreRankingListTitle.svelte';
	import { sleep, toUrl } from '$lib/functions/util';

	export let bundleId:string;
	export let selectedIndex = 0;
	export let categories;
	export let subCategories = [];
	export let isEvent = false;
	export let hasEventRanking = false;

	let selecting = false;
	let wrapArea:HTMLDivElement;
	let slideLeft = false;
	let slideRight = false;

	const smallHeight = smaller('xs', true);
	const smallWidth = smaller('lg');

	$: asLandscape = $smallHeight && $smallWidth;

	async function onClickedListTitle(index) {
		if(slideLeft){
			return;
		}
		selectedIndex = index;
		selecting = true;
		slideLeft = true;
		if( asLandscape ){
			wrapArea.parentNode.scrollTop = hasEventRanking ? (isEvent ? 68 : 124) : 72;
		}
		await sleep(300);
		slideLeft = false;
	}

	async function onClickedRankingTitle(){
		if(slideRight){
			return;
		}
		selecting = false;
		slideRight = true;
		await sleep(300);
		slideRight = false;
	}

	function onClickedLinkTab(routeId){
		goto(toUrl(routeId, { bundleId }));
	}
</script>

<div bind:this={wrapArea} class="fit-content lg:(flex justify-center h-full)">
	<div class="<lg:w-full lg:w-128 mr-2">
		<div class="{ asLandscape ? '':'flex flex-col absolute top-0 bottom-0'} <lg:w-full lg:w-128">
			<div class:pt-4={!hasEventRanking}>
				{#if hasEventRanking }
					<div class="mt-4 mb-5">
						<Tabs value={ $page.route.id } segmented class="flex items-center justify-center">
							<TabNav centered>
								{#each categories as item}
									<TabNavItem value={ item.routeId } on:click={ () => onClickedLinkTab(item.path) }>{ item.label }</TabNavItem>
								{/each}
							</TabNav>
						</Tabs>
					</div>
				{/if}
				<slot name='mode-categories'/>
			</div>
			<div class="lg:hidden { asLandscape ? '':'flex-grow h-10'} relative overflow-hidden fi-border border-t">
				{#if !selecting || slideLeft}
					<div class="w-full { asLandscape ? '':'absolute inset-0 overflow-y-auto'}"
						class:slideInRight={slideRight}
						class:slideOutLeft={slideLeft}
					>
						<ul>
							{#each subCategories as item, index}
								<li class="ranking-title text-sm cursor-pointer lg:(px-4 rounded-lg)"
									class:selected={ selectedIndex == index }
									on:click={ () => onClickedListTitle(index) }
								>
									<GameScoreRankingListTitle
										name={ item.name}
										{isEvent}
										current={ item.current }
									/>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if selecting || slideRight}
					<div class="w-full { asLandscape ? '':'absolute inset-0 overflow-y-auto'}"
						class:slideInLeft={slideLeft}
						class:slideOutRight={slideRight}
					>
						<div class="{ asLandscape ? '':'flex flex-col absolute top-0 bottom-0 w-full'}">
							<div class="ranking-title text-sm cursor-pointer"
								on:click={ onClickedRankingTitle }>
								<GameScoreRankingListTitle
									name={ subCategories[selectedIndex].name}
									{isEvent}
									current={ subCategories[selectedIndex].current }
								/>
							</div>
							<div class="{ asLandscape ? '':'relative flex-grow overflow-hidden h-10'}">
								<div class="{ asLandscape ? '':'absolute inset-0 overflow-y-auto'}">
									<slot name='ranking'/>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="<lg:hidden relative flex-grow overflow-hidden h-10">
				<ul class="fi-border border rounded-lg mx-6 mb-2 absolute inset-0 overflow-y-auto">
					{#each subCategories as item, index}
						<li class="ranking-title text-sm cursor-pointer px-4 rounded-lg"
							class:selected={ selectedIndex == index }
							on:click={ () => onClickedListTitle(index) }
						>
							<GameScoreRankingListTitle
								name={ item.name}
								{isEvent}
								current={ item.current }
							/>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	<div class="<lg:hidden">
		<slot name='ranking'/>
	</div>
</div>

<style>
	@screen lg {
		.fit-content {
			min-width: fit-content;
		}
		.ranking-title {
			@apply text-base-dark text-opacity-60;
		}
		:global(.dark) .ranking-title {
			@apply text-white text-opacity-60;
		}
		.ranking-title.selected {
			@apply bg-opacity-8 bg-base-dark text-base-dark text-opacity-87;
		}
		:global(.dark) .ranking-title.selected {
			@apply bg-opacity-8 bg-base-light text-white text-opacity-87;
		}
	}
	.slideInLeft {
		animation: slide-in-left 300ms forwards;
		@apply absolute top-0;
	}
	@keyframes slide-in-left {
		0% { transform: translateX(100%); }
		100% { transform: translateX(0%); }
	}
	.slideOutLeft {
		animation: slide-out-left 300ms forwards;
	}
	@keyframes slide-out-left {
		0% { transform: translateX(0%); }
		100% { transform: translateX(-100%); }
	}
	.slideInRight {
		animation: slide-in-right 300ms forwards;
		@apply absolute top-0;
	}
	@keyframes slide-in-right {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(0%); }
	}
	.slideOutRight {
		animation: slide-out-right 300ms forwards;
	}
	@keyframes slide-out-right {
		0% { transform: translateX(0%); }
		100% { transform: translateX(100%); }
	}
</style>