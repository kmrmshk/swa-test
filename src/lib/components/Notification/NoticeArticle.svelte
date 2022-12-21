<script lang="ts">
	import { article } from '$lib/stores/ui';

	export let title = '';
	export let date = '';
	export let imageUrl = '';
	export let body = '';
</script>

<section class="w-full mx-auto round bg-white dark:bg-gray-800 border-t-1 border-base-dark border-opacity-10 md:(overflow-hidden rounded-lg border-1)">
	{#if imageUrl}
		<div class="aspect-w-2 aspect-h-1 bg-base-dark bg-opacity-20 bg-cover"
			style={`background-image: url(${ imageUrl });`}></div>
	{/if}
	<h2 class="pt-3 px-4 md:pt-5 md:px-6">
		<span class="fi-text text-base md:text-2xl">
			{ title }
		</span>
		<br>
		<time class="fi-text-sub md:mt-1 text-sm md:text-base">
			{ date }
		</time>
	</h2>
	<hr class="my-5 mx-3 border-t-1 border-base-dark border-opacity-10">
	<div class="fi-text px-4 pb-4 md:px-6 md:pb-6 {$article}">
		{@html body}
	</div>
</section>