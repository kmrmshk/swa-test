<script lang="ts">
	import { getContext } from 'svelte';
	import { tabsContext } from '$lib/components/Tabs/Tabs.svelte';

	export let value = null;
	export let path = null;

	const panel = {
		value: value,
		path: path
	};
	const { registerPanel, selectedPanel } = getContext(tabsContext);

	registerPanel(panel);
</script>

{#if $selectedPanel === panel}
	<slot />
{/if}