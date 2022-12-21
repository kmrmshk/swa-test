<script lang="ts">
	import { goto } from '$app/navigation';
	import { parseTextLink } from '$lib/functions/util';
	import { article } from '$lib/stores/ui';
	import Tag from '$lib/components/Tag';
	import { encodeURI } from '$lib/functions/util';

	export let description = '';
	export let tags = [];

	function nl2br(str) {
		str = str.replace(/\r\n/g, "<br>");
		str = str.replace(/(\n|\r)/g, "<br>");
		return str;
	}

	function onClickedTag(tag){
		goto(`/tags/${ encodeURI(tag.name) }`);
	}
</script>
<div class="p-3 {$article}">
	{@html nl2br(parseTextLink(description, true, true, true, true))}
</div>
{#if tags.length}
	<div class="px-3 pb-3">
		{#each tags as tag}
			<Tag on:click={ () => onClickedTag(tag) } class="my-1 mr-1.5 cursor-pointer">{tag.name}</Tag>
		{/each}
	</div>
{/if}