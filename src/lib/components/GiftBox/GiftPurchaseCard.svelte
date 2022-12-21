<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/Card';

	const dispatch = createEventDispatcher();

	export let thumbnail = '';
	export let price = 0;
</script>

<Card inline class="overflow-hidden shadow-01dp transition cursor-pointer transform origin-top hover:(shadow-04dp scale-101)"
	rounded="lg"
	on:click={() => dispatch('selectGift')}>
	<div class="flex flex-col items-center px-4 py-2 min-w-full bg-white dark:bg-opacity-10">
		<div class="w-16 h-16 flex-shrink-0 bg-white dark:bg-transparent bg-contain bg-center"
			style="{`background-image: url(${thumbnail});`}"></div>
		<div class="flex items-center justify-start focus:outline-none pt-2 relative w-full text-sm leading-tight">
			<img class="mr-1" src="/assets/images/icons/coin.svg" width="22" height="22" alt="coin"/>
			<span class="inline-block font-bold">{ price }</span>
		</div>
	</div>
</Card>