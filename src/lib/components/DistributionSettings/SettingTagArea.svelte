<script lang="ts">
	import { onMount } from 'svelte';
	import { smaller } from '$lib/stores/breakpoint';
	import { mobile } from '$lib/stores/device';
	import { thumbnailUrl, channel } from '$lib/stores/user';
	import Tag from '$lib/components/Tag';
	import { LiveCardBase } from '$lib/components/LiveCard';
	import SortTags from './SortTags.svelte';

	const maxTagLength = 15;
	const small = smaller('sm');
	$: isFillTarget = $mobile || $small;

	export let isGameStart = false;
	export let selectedTags = [];
	export let distribution = {};
	export let bundleId = '';
	export let allTags =[];

	onMount( ()=>{
		if( bundleId ){
			const bundleTag = allTags.find( tag => tag?.bundleId === bundleId );
			if( bundleTag ){
				bundleTag.selected = true;
				allTags = allTags;
				if( ! selectedTags.some( tag => tag?.bundleId === bundleId ) ){
					selectedTags.splice(maxTagLength - 1, 1, bundleTag);
					selectedTags = selectedTags;
				}
			}
		}
		allTags.forEach( aTag => {
			aTag.selected = selectedTags.some( tag => tag.id == aTag.id );
		})
		allTags = allTags;
	});

	async function selectTag(index){
		if( bundleId && bundleId == allTags[index].bundleId ){
			return;
		}

		const selectedIndex = selectedTags.findIndex( tag => tag.id == allTags[index].id);
		if( selectedIndex > -1 ){
			allTags[index].selected = false;
			selectedTags.splice(selectedIndex, 1);
		}
		else if( selectedTags.length >= maxTagLength ){
			return;
		}
		else{
			allTags[index].selected = true;
			selectedTags.push(allTags[index]);
		}
		allTags = allTags;
		selectedTags = selectedTags;
	}
</script>

<p class="pt-3 md:px-6 px-3">
	{#if isGameStart}
		配信タグを選択してください。
	{:else}
		配信タグ設定
	{/if}
</p>
<div class="pt-2 md:px-6 px-3">
	{#each allTags as tag, index}
		<Tag disabled={ (bundleId && bundleId == tag.bundleId) || (selectedTags.length >= maxTagLength && !tag.selected) } key={index} class="my-1 mr-1.5" mode={ tag.selected ? "selected" : "unselected" } on:click={ () => selectTag(index) } >{tag.name}</Tag>
	{/each}
</div>
<p class="pt-4 md:px-6 px-3">
	配信タグ並び替え
	<span class="text-xs opacity-60" class:block={isFillTarget}>設定した配信タグをドラッグ&amp;ドロップで並び替えできます</span>
</p>
<div class="pt-2 md:px-6 px-3">
		<SortTags bind:selectedTags={selectedTags} />
</div>
<p class="pt-4 pb-3 md:px-6 px-3">
	配信プレビュー
	<span class="text-xs opacity-60" class:block={isFillTarget}>設定した配信タグは下図のように表示されます</span>
</p>
<div class="overflow-hidden" class:mx-6={!isFillTarget}>
	<section class="grid-cols-3 gap-4 bg-base-light dark:bg-gray-900 py-5 "
		class:grid={!isFillTarget}
		class:md:px-6={isFillTarget}
		class:px-3={isFillTarget}
		style={`${ isFillTarget ? '' : 'width: 160%; margin-left:-30%;'}`}>
		{#if !isFillTarget}
			<LiveCardBase />
		{/if}
		<LiveCardBase
			onAir={distribution.status !== 'Completed'}
			distributorUuid={distribution.distributorUuid}
			title={distribution.title}
			thumbnailUrl={distribution.thumbnailUrl}
			userName={$channel.title}
			userThumbnailUrl={$thumbnailUrl}
			official={distribution?.isOfficial}
			tags={selectedTags}
		/>
		{#if !isFillTarget}
			<LiveCardBase />
		{/if}
	</section>
</div>
