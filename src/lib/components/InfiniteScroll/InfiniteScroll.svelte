<script lang="ts">
	import intersectElement from '$lib/actions/intersectElement';
	import { createEventDispatcher, tick } from 'svelte';
	import { sleep } from '$lib/functions/util';

	export let active = true;

	const delay = 250;
	const dispatch = createEventDispatcher();

	let intersecting = false;

	export async function validate() {
		await tick();
		await sleep(delay);
		if (intersecting && active) {
			onIntersected();
		}
	}

	function onIntersected() {
		dispatch('more');
	}
</script>

{#if active}
<div use:intersectElement
	on:update={ (e) => intersecting = e.detail }
	on:intersect={ onIntersected }
	class="w-full h-1px bg-transparent"
></div>
{/if}