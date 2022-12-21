<script lang="ts">
	import { uuid, channel, prepared } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import slice from 'lodash/slice';
	import format from 'date-fns/format/index.js';

	import TabNav from '$lib/components/Tabs/TabNav.svelte';
	import TabNavItem from '$lib/components/Tabs/TabNavItem.svelte';
	import Tabs from '$lib/components/Tabs/Tabs.svelte';
	import { SupporterRankCard } from '$lib/components/SupporterRankList';
	import Avatar from '$lib/components/Avatar';

	import { UsersApi, type FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_RankingUserPublic as RankingUser } from '$lib/apis';
	import Metatags from '$lib/components/Metatags';

	const todayFormat = format(new Date(), 'yyyy-MM-dd');
	const categoryDaily = 'daily';
	const categoryWeekly = 'weekly';
	const categoryMonthly = 'monthly';
	const categoryTotal = 'total';

	let days = [
		{
			label: '今日',
			category: categoryDaily,
		},
		{
			label: '今週',
			category: categoryWeekly,
		},
		{
			label: '今月',
			category: categoryMonthly,
		},
		{
			label: '累計',
			category: categoryTotal,
		},
	];

	let selectedRankings:Array<RankingUser> = [];
	let selectedCategory = categoryTotal;
	let dailyRankings:Array<RankingUser> = [];
	let weeklyRankings:Array<RankingUser> = [];
	let monthlyRankings:Array<RankingUser> = [];
	let totalRankings:Array<RankingUser> = [];

	$: upperRankedUsers = slice(selectedRankings, 0, 3);
	$: lowerRankedUsers = slice(selectedRankings, 3);
	$: {
		switch(selectedCategory) {
			case categoryDaily:
				selectedRankings = dailyRankings;
				break;
			case categoryWeekly:
				selectedRankings = weeklyRankings;
				break;
			case categoryMonthly:
				selectedRankings = monthlyRankings;
				break;
			case categoryTotal:
				selectedRankings = totalRankings;
				break;
			default:
				selectedRankings = [];
		}
	}

	$: if($prepared) {
		Promise.all([
			fetchDailyRankings(),
			fetchWeeklyRankings(),
			fetchMonthlyRankings(),
			fetchTotalRankings(),
		]);
	}

	function onClickedAvatar(uuid) {
		goto(`/users/${ uuid }`);
	}

	function fetchDailyRankings() {
		UsersApi.getApiV1UsersRankingsItemsDaily({
			uuid: `${$uuid}`,
			date: todayFormat
		})
		.then(data => dailyRankings = data.rankingUsers || [])
		.catch(console.error);
	}

	function fetchWeeklyRankings() {
		UsersApi.getApiV1UsersRankingsItemsWeekly({
			uuid: `${$uuid}`,
			date: todayFormat
		})
		.then(data => weeklyRankings = data.rankingUsers || [])
		.catch(console.error);
	}

	function fetchMonthlyRankings() {
		UsersApi.getApiV1UsersRankingsItemsMonthly({
			uuid: `${$uuid}`,
			date: todayFormat
		})
		.then(data => monthlyRankings = data.rankingUsers || [])
		.catch(console.error);
	}

	function fetchTotalRankings() {
		UsersApi.getApiV1UsersRankingsItemsOverAll({
			uuid: `${$uuid}`
		})
		.then(data => totalRankings = data.rankingUsers || [])
		.catch(console.error);
	}
</script>

<Metatags
	useSuffix
	title="{$channel.title} / サポートランキング"
/>

<section class="text-center">
	<div class="pt-3 px-4 md:(pt-6 px-5) inline-flex justify-center">
		<Tabs segmented minimum bind:value={ selectedCategory } class="inline-flex">
			<TabNav class="w-full">
				{#each days as item, index}
					<TabNavItem value={ item.category }>{ item.label }</TabNavItem>
				{/each}
			</TabNav>
		</Tabs>
	</div>

	{#if selectedRankings.length}
		<div class="md:vmd:hidden w-full pt-3 px-4">
			{#each selectedRankings as item, index}
				<SupporterRankCard
					class="my-2"
					uuid={ item.uuid }
					name={ item.youTubeChannelTitle }
					point={ item.price }
					thumbnail={ item.thumbnailUrl || '/assets/images/icons/avatar.svg'}
					rank={ item.rank }
				/>
			{/each}
		</div>
		<div class="hidden md:vmd:flex pt-20 pb-3 justify-center items-end">
			{#each upperRankedUsers as item}
				<SupporterRankCard
					rows={false}
					class="mx-2 max-w-166px shadow-01dp border-none {item.rank == 1 ? 'h-31 order-2': (item.rank == 2 ? 'h-25 order-1':'h-22 order-3')}"
					name={ item.youTubeChannelTitle }
					point={ item.price }
					rank={ item.rank }
				>
					<Avatar slot="thumbnail" class="absolute cursor-pointer {item.rank == 1 ? '-top-6.5': (item.rank == 2 ? '-top-4.5':'-top-7.5')}"
						size={item.rank == 1 ? 80 : 48}
						rounded={item.rank == 1 ?'4xl':'2xl'}
						on:click={ () => onClickedAvatar(item.uuid) }
						thumbnail={ item.thumbnailUrl || '/assets/images/icons/avatar.svg' }/>
					<i class="icon fingger-crown text-2xl absolute {item.rank == 1 ? '-top-13': (item.rank == 2 ? '-top-11':'-top-14')}"></i>
				</SupporterRankCard>
			{/each}
		</div>
		<div class="hidden md:vmd:grid mx-auto px-6 pb-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 max-w-screen-xl">
			{#each lowerRankedUsers as item, index}
				<SupporterRankCard
					class="shadow-02dp"
					uuid={ item.uuid }
					name={ item.youTubeChannelTitle }
					point={ item.price }
					thumbnail={ item.thumbnailUrl || '/assets/images/icons/avatar.svg'}
					rank={ item.rank }
				/>
			{/each}
		</div>
	{:else}
		<div class="pt-10 md:pt-20 text-center font-bold text-base md:text-lg fi-text-sub">
			ランキングはありません
		</div>
	{/if}
</section>
