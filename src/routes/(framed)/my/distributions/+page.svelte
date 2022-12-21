<script lang="ts">
	import type { PageData } from './$types';
	import streams from './streams/+page.svelte';
	export let data:PageData;
</script>
<svelte:component this={streams} {data} />