<script lang="ts">
	import slice from 'lodash/slice';
	import { goto } from '$app/navigation';
	import { sidebar } from '$lib/stores/ui';
	import Avatar from '$lib/components/Avatar';
	import GameScoreRankingCard from './GameScoreRankingCard.svelte';

	export let rankingData = [];

	$: upperRankedUsers = slice(rankingData, 0, 3);
	$: lowerRankedUsers = slice(rankingData, 3);

	function onClickedAvatar(uuid) {
		goto(`/users/${ uuid }`);
	}
</script>

<div class="<lg:px-4 lg:(w-112 h-full) { $sidebar ? '2xl:w-189':'xl:w-189'}">
	<div class="lg:(flex flex-col h-full w-112) { $sidebar ? '2xl:w-189':'xl:w-189'}">
		{#if rankingData.length}
			<div class="<lg:hidden lg:(pt-20 pb-3 flex justify-center items-end)">
				{#each upperRankedUsers as item}
					<GameScoreRankingCard
						altar
						rows={false}
						class="mx-2 max-w-166px shadow-01dp border-none {item.rank == 1 ? 'h-31 order-2': (item.rank == 2 ? 'h-25 order-1':'h-22 order-3')}"
						name={ item.userName }
						score={ item.scoreString }
						rank={ item.rank }
						to={ item.distributionUuid }
					>
						<Avatar slot="thumbnail"
							rounded={item.rank == 1 ?'4xl':'2xl'}
							class="absolute cursor-pointer {item.rank == 1 ? '-top-6.5': (item.rank == 2 ? '-top-4.5':'-top-7.5')}"
							size={item.rank == 1 ? 80 : 48}
							on:click={ () => onClickedAvatar(item.userUuid) }
							thumbnail={ item.userThumbnail || '/assets/images/icons/avatar.svg' }/>
						<i class="icon fingger-crown text-2xl absolute {item.rank == 1 ? '-top-13': (item.rank == 2 ? '-top-11':'-top-14')}"></i>
					</GameScoreRankingCard>
				{/each}
			</div>
			<div class="lg:(relative flex-grow overflow-hidden h-10)">
				<div class="lg:(max-h-full overflow-x-hidden overflow-y-auto mb-2)">
					<div class="lg:(mx-auto mx-3 pb-6 grid grid-cols-1 gap-2) { $sidebar ? '2xl:grid-cols-2':'xl:grid-cols-2'}">
						{#each upperRankedUsers as item}
							<GameScoreRankingCard
								class="lg:hidden <lg:my-2"
								uuid={ item.userUuid }
								name={ item.userName }
								score={ item.scoreString }
								thumbnail={ item.userThumbnail || '/assets/images/icons/avatar.svg'}
								rank={ item.rank }
								to={ item.distributionUuid }
							/>
						{/each}
						{#each lowerRankedUsers as item}
							<GameScoreRankingCard
								class="lg:shadow-02dp <lg:my-2"
								uuid={ item.userUuid }
								name={ item.userName }
								score={ item.scoreString }
								thumbnail={ item.userThumbnail || '/assets/images/icons/avatar.svg'}
								rank={ item.rank }
								to={ item.distributionUuid }
							/>
						{/each}
					</div>
					<slot />
				</div>
			</div>
		{:else}
			<div class="pt-10 text-center font-bold text-base fi-text-sub lg:(pt-20 text-lg)">
				ランキングはありません
			</div>
		{/if}
	</div>
</div>
