<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { eventPurchaseStatus } from '$lib/components/GlobalHeader';
	import { authorized } from '$lib/services/auth';

	export let data:PageData;

	const { status, publishKey, id } = data;
	const origin = $page.url.origin;

	onMount(async () => {
		if(!browser) {
			return;
		}
		else if(!$authorized) {
			window.opener ? window.close() : goto('/');
		}
		else if(status === 'processing') {
			try {
				const stripe = await loadStripe(publishKey);
				await stripe?.redirectToCheckout({
					sessionId: id
				});
			} catch (e) {
				window.opener ? window.close() : goto('/');
			}
		}
		else if(window.opener) {
			window.opener.postMessage({
				type: eventPurchaseStatus,
				status,
				transactionId: id
			}, origin);
			window.close();
		}
		else {
			goto('/checkout');
		}
	});
</script>