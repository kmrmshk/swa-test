<script lang="ts">
	import type { PageData } from './$types';
	import events from './events/+page.svelte';
	import usual from './usual/+page.svelte';

	export let data:PageData;

	let rankings = data.rankings;
	let pageComponent = usual;

	if($rankings?.event.length) {
		pageComponent = events;
	}
</script>
<svelte:component this={pageComponent} {data} />