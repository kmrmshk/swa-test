<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const gtmId = `${import.meta.env.google_analyticsid}`;
	$: if(!!gtmId.length && browser) {
		if (typeof window['gtag'] !== 'undefined') {
			window['gtag']('config', gtmId, {
				page_title: document.title,
				page_path: $page.url.pathname,
			});
		}
	}
</script>

<svelte:head>
	{#if !!gtmId.length}
		{@html `<script async src="https://www.googletagmanager.com/gtag/js?id=${gtmId}"></script><script>
			window.dataLayer = window.dataLayer || [];
			function gtag() { dataLayer.push(arguments); }
			gtag('js', new Date());
			gtag('config', '${gtmId}');
		</script>`}
	{/if}
</svelte:head>