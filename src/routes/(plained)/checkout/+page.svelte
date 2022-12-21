<!-- Safari対策のため、ブランクページを用意しています -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if(!browser) {
			return;
		}
		if(!window.opener) {
            goto('/');
		} else {
			window.setTimeout(window.close, 10000);
		}
	});
</script>