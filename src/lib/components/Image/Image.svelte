<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	export let src = '';
	export let aux = '';
	export let alt = '';
	export let width = 'auto';
	export let height = 'auto';
	export let lazy = false;

	let element:HTMLImageElement;

	onMount(() => {
		browser && element.addEventListener('error', onError);
	});

	onDestroy(() => {
		browser && element.removeEventListener('error', onError);
	});

	function onLoad() {
		element.classList.add('loaded');
	}

	function onError() {
		element.src = aux ? aux : 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7';
	}
</script>

<img
	bind:this={ element }
	loading={ lazy ? 'lazy' : 'eager' }
	class="{ $$props.class || '' }"
	src={ src || aux }
	style="width:{ width };height:{ height }"
	{ alt }
	on:load={ onLoad }
	on:click
	on:mouseover
	on:mouseout
	on:blur
	on:focus
/>