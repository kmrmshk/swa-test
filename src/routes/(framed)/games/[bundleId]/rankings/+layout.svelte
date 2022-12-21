<script lang="ts">
	import type { LayoutData } from './$types';
	import { GamesApi } from '$lib/apis';
	import Loading from '$lib/components/Loading';
	import Metatags from '$lib/components/Metatags';

	export let data:LayoutData;
	let promise = Promise.resolve();
	let bundleInfo = data.bundleInfo;
	let rankings = data.rankings;

	$: if(bundleInfo?.bundleId) {
		fetchGameRankingSettings();
	}

	function fetchGameRankingSettings() {
		promise = Promise.all([
			GamesApi.getApiV1GamesRankingsSettings({
				bundleId: bundleInfo?.bundleId,
				type: 'event'
			})
				.then(data => {
					if (data) {
						$rankings.event = data;
					}
				}),
			GamesApi.getApiV1GamesRankingsSettings({
				bundleId: bundleInfo?.bundleId,
				type: 'usual'
			})
				.then(data => {
					if (data) {
						$rankings.usual = data;
					}
				})
		]).then( _ =>{
			$rankings = $rankings;
		})
		.catch(console.error);
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ bundleInfo?.title } | ランキング"
	description="{ bundleInfo?.title } | ランキング"
/>

{#await promise}
	<div class="flex justify-center items-center h-full w-full overflow-hidden pointer-events-none">
		<Loading light="#06A3B4" dark="#7ED9E2" size="32" />
	</div>
{:then _ }
	{#if $rankings?.event.length || $rankings?.usual.length}
		<slot />
	{:else}
		<div class="pt-8 md:pt-20 text-center font-bold text-sm md:text-xl fi-text-sub">
			ランキングはありません
		</div>
	{/if}
{/await}
