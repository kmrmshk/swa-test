<script lang="ts">
	import type { PageData } from './$types';
	import { GamesApi } from '$lib/apis';
	import Card from '$lib/components/Card';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import Metatags from '$lib/components/Metatags';

	export let data:PageData;

	const limitPerFetch = 20;

	let { games } = data;
	let promise = Promise.resolve();
	let scroll:InfiniteScroll;

	const fetchGames = () => {
		return GamesApi.getApiV1Games1({
			limit: limitPerFetch,
			offset: games.length
		})
			.then(data => {
				if (data?.length) {
					games = games.concat(data);
					scroll?.validate();
				}
			})
			.catch(console.error);
	};

	function addToPromise(f) {
		promise = promise.then(() => f());
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="ゲーム一覧"
	description="ゲーム一覧"
/>

<div class="m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-8 py-4 md:px-10 md:py-10 w-full max-w-8xl">
	{#each games as game}
		<a href={ `/games/${ game.bundleId }` }>
			<Card
				class="block w-full aspect-w-16 aspect-h-9 rounded-xl shadow-01dp bg-cover bg-center transition cursor-pointer transform origin-top hover:(shadow-04dp scale-101)"
				style={`background-image: url(${ game?.thumbnailImageUrl });`}>
			</Card>
			<h3 class="px-4 pt-2">
				<span>{ game.title }</span>
			</h3>
			<p class="px-4 pt-1 pb-2 fi-lb fi-text text-sm leading-normal font-light">
				<span class="line-clamp-2">{@html game.shortDescription}</span>
			</p>
		</a>
	{/each}
	<InfiniteScroll
		bind:this={ scroll }
		on:more={ () => addToPromise(fetchGames) }
	/>
</div>
