<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ErrorDocument from '$lib/components/ErrorDocument';

	onMount(() => {
		browser && window.setTimeout(() => {
			goto('/');
		}, 3000);
	});
</script>

<svelte:head>
	<title>Error | fingger（フィンガー）</title>
</svelte:head>

<ErrorDocument class="pt-16 pb-22">
	<span slot="title">
		Oh no!
	</span>
	<div slot="message" class="m-auto w-max-280px">
		Something went wrong.<br>Please try again.
	</div>
</ErrorDocument>