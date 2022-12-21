<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if(!browser) {
			return;
		}
		// NOTE: postmessageを使わずにここで認証を済ませる
		const authorizationCode = decodeURIComponent(location.href.replace(/.*code=([^&]+).*$/, '$1'));
		if(window.opener) {
			window.opener.postMessage({
				type: 'google-api-authorization-code',
				code: authorizationCode
			}, import.meta.env.vite_endpoint);
			window.close();
		} else {
			goto('/', {replaceState: true});
		}
	});
</script>