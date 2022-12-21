<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import throttle from 'lodash/throttle';
	import SupporterRankCard from './SupporterRankCard.svelte';
	import { DistributionsApi } from '$lib/apis';
	import VirtualList from '$lib/components/VirtualList';

	export let streamUuid = '';

	const oneMinute = 1000 * 60;
	const throttledFetch = throttle(fetchRankings, oneMinute);

	let rankingUsers = [];
	let intervalId = -1;

	$: if (streamUuid) {
		fetchRankings();
	}

	onMount(() => {
		// NOTE: every 3min
		intervalId = window.setInterval(async _ => throttledFetch, oneMinute * 3);
	});

	onDestroy(() => {
		window.clearInterval(intervalId);
	});

	function fetchRankings() {
		DistributionsApi.getApiV1DistributionsRankingsItem({ uuid: streamUuid })
			.then(data => {
				if (data) {
					rankingUsers = data?.rankingUsers ?? [];
				}
			})
			.catch(console.error);
	}
</script>

<div class="relative h-full">
	<div class="absolute top-0 bottom-0 w-full h-full py-2">
		<VirtualList
			items={ rankingUsers }
			let:item >
			<div class="px-4 py-0.5 md:py-1">
				<SupporterRankCard
					uuid={ item.uuid }
					name={ item.youTubeChannelTitle }
					point={ item.price }
					thumbnail={ item.thumbnailUrl || '/assets/images/icons/avatar.svg'}
					rank={ item.rank }
				/>
			</div>
		</VirtualList>
	</div>
</div>