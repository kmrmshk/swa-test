<script lang="ts">
	import { dark } from '$lib/stores/theme';
	import Card from '$lib/components/Card';
	import Avatar from '$lib/components/Avatar';
	import Image from '$lib/components/Image';
	import LiveChip from './LiveChip.svelte';
	import OfficialChip from './OfficialChip.svelte';
	import Tag from '$lib/components/Tag';
	import { createEventDispatcher } from 'svelte';
	import { formatTime } from '$lib/functions/util';

	const dispatch = createEventDispatcher();

	export let title = '';
	export let thumbnailUrl = '';
	export let userName = '';
	export let userThumbnailUrl = '';
	export let distributorUuid = '';
	export let onAir = false;
	export let official = false;
	export let tags = [];
	export let selectedTags = [];
	export let playable = false;
	export let playing = false;
	export let duration = 0;

	let unselectedTags = [];

	$: unselectedTags = tags?.filter( a => (selectedTags.findIndex( b => b.id == a.id ) < 0 ) ) ?? [];

	function onClickedDistributor(){
		dispatch('click-distributor');
	}
	function onClickedTag(tag){
		dispatch('click-tag', tag);
	}
</script>

<Card on:click on:mouseenter on:mouseleave
	class="liveCard border-none transition shadow-03dp overflow-hidden origin-top transform hover:(shadow-08dp scale-101) ease-out duration-250 {$$props.class || ''}">
	<div class="relative aspect-w-16 aspect-h-9 bg-base-dark min-w-full border-none overflow-hidden">
		<slot name="player"/>
		<div class="bg-thumbnail absolute inset-0 bg-base-light overflow-hidden border-none origin-center transition-all transform scale-100 duration-250 { playing ? 'opacity-0':'opacity-100 z-1'} { playable ? '':'hover:(scale-104 opacity-80 bg-blend-overlay duration-3000)'}">
			{#key thumbnailUrl}
				{#if thumbnailUrl}
					<Image lazy
						class="thumbnail fi-img-center"
						width="100%"
						height="auto"
						src={ thumbnailUrl }
						aux={ `/assets/images/thumbs/default${ $dark ? '@dark' : '' }.png` }
					/>
				{/if}
			{/key}
			<div class="pt-3 px-4 flex items-start justify-end relative w-full top-0 z-2">
				{#if onAir}
					<LiveChip/>
				{/if}
				{#if official}
					<OfficialChip class={ onAir ? 'ml-2' : '' }/>
				{/if}
			</div>
			{#if ! onAir && duration}
				<div class="absolute inset-0 z-1 pointer-events-none">
					<time class="inline-box absolute right-3 bottom-2 px-2 py-0.5 text-white text-sm bg-base-dark bg-opacity-70">{ formatTime(duration) }</time>
				</div>
			{/if}
		</div>
	</div>
	<div on:click={ e => e.stopPropagation() } class="pl-3 pr-1.5 w-full h-10 bg-base-dark overflow-hidden">
		{#each selectedTags as tag, i}
			<Tag on:click={ () => onClickedTag(tag) } class="my-2 { i == selectedTags.length-1 ? 'mr-0.5' : 'mr-1.5' }" mode="search">{tag.name}</Tag>
		{/each}
		{#each unselectedTags as tag}
			<Tag on:click={ () => onClickedTag(tag) } class="my-2 mr-1.5">{tag.name}</Tag>
		{/each}
	</div>
	<div class="relative bg-white dark:bg-gray-800 px-2">
		<div class="flex relative items-start mt-4 mb-1.5 min-w-full h-16">
			<Avatar
				on:click={onClickedDistributor}
				rounded="2xl"
				class="{ !!distributorUuid ? 'cursor-pointer' : 'pointer-events-none'} flex-grow-0 flex-shrink-0 ml-1 mr-3 w-12 transition transform hover:scale-102"
				style="{ official ? 'box-shadow: 0 0 0 3px #06A3B4;' : ''}"
				thumbnail={userThumbnailUrl}
				size="48"
				border
			/>
			<div class="flex flex-col h-full justify-around overflow-hidden">
				<div title={ title } class="fi-text fi-lb fi-anchor text-sm font-bold max-h-10 overflow-hidden line-clamp-2 cursor-pointer">
					{ title }
				</div>
				<div on:click|stopPropagation={onClickedDistributor} title={ userName } class="fi-text-sub fi-anchor text-xs cursor-pointer line-clamp-1">
					{ userName }
				</div>
			</div>
		</div>
		<div class="flex items-center justify-between min-w-full h-10 border-t border-base-dark border-opacity-10 dark:(border-white border-opacity-10)">
			<slot name="footer"/>
		</div>
	</div>
</Card>

<style lang="scss">
	.bg-thumbnail{
		background-color: #909BB1;
		@apply bg-opacity-85;
	}
</style>