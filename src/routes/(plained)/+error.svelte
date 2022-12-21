<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import ErrorDocument from '$lib/components/ErrorDocument';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { notify } from '$lib/functions/util';

	onMount(() => {
		if(!browser) {
			return;
		}
		if(dev) {
			notify($page.error?.message);
			console.log($page.error);
		} else {
			window.setTimeout(() => {
				if(window.opener) {
					window.close();
				} else {
					goto('/');
				}
			}, 3000);
		}
	});
</script>

<ErrorDocument class="pt-16 pb-22">
	<span slot="title">
		Oh no!
	</span>
	<div slot="message" class="m-auto w-max-280px">
		Something went wrong.
	</div>
</ErrorDocument>