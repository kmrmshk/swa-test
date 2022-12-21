<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/Card';

	const dispatch = createEventDispatcher();

	export let thumbnail = '';
</script>

<Card class="rounded-lg overflow-hidden shadow-01dp transition cursor-pointer transform origin-top hover:(shadow-04dp scale-101)">
	<div
		on:click={() => dispatch('selectGacha') }
		class="aspect-w-35 aspect-h-23 min-w-full bg-cover bg-center"
		style={`background-image: url(${thumbnail});`}>
	</div>
	<div class="fi-text-sub relative bg-white dark:bg-opacity-10 px-3 py-2 text-right">
		<span class="fi-text-sub fi-anchor cursor-pointer text-sm"
			on:click={() => dispatch('gachaItemDetail') }>詳細</span>
		<span class="fi-text-sub text-sm">|</span>
		<span class="fi-text-sub fi-anchor cursor-pointer text-sm"
			on:click={() => dispatch('emissionRatio') }>提供割合</span>
	</div>
</Card>