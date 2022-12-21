<script lang="ts">
	import { goto } from '$app/navigation';
	import slice from 'lodash/slice';
	import format from 'date-fns/format/index.js';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import { SupporterRankCard } from '$lib/components/SupporterRankList';
	import Avatar from '$lib/components/Avatar';
	import Metatags from '$lib/components/Metatags';
	import { UsersApi, type FinggerPlatform_Server_Shared_DataTransferObjects_ItemRanking_RankingUserPublic as UserPublic } from '$lib/apis';
	import { page } from '$app/stores';

	const todayFormat = format(new Date(), 'yyyy-MM-dd');
	const categoryDaily = 'daily';
	const categoryWeekly = 'weekly';
	const categoryMonthly = 'monthly';
	const categoryTotal = 'total';

	let userUuid:string;
	let userData:UserPublic;
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

	let selectedRankings:Array<UserPublic> = [];
	let selectedCategory = categoryTotal;
	let dailyRankings:Array<UserPublic> = [];
	let weeklyRankings:Array<UserPublic> = [];
	let monthlyRankings:Array<UserPublic> = [];
	let totalRankings:Array<UserPublic> = [];

	$: ({ userUuid, userData } = $page.data);
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

	const fetchAll = async () => {
		await Promise.all([
			fetchDailyRankings(),
			fetchWeeklyRankings(),
			fetchMonthlyRankings(),
			fetchTotalRankings(),
		]);
	};

	$: if(userUuid) {
		selectedRankings = [];
		selectedCategory = categoryTotal;
		dailyRankings = [];
		weeklyRankings = [];
		monthlyRankings = [];
		totalRankings = [];
		fetchAll();
	}

	function onClickedAvatar(uuid:string) {
		goto(`/users/${ uuid }`);
	}

	function fetchDailyRankings() {
		UsersApi
			.getApiV1UsersRankingsItemsDaily({
				uuid: userUuid,
				date: todayFormat
			})
			.then(data => dailyRankings = data.rankingUsers || [])
			.catch(e => {
				console.error(e);
				return [];
			});
	}

	function fetchWeeklyRankings() {
		UsersApi
			.getApiV1UsersRankingsItemsWeekly({
				uuid: userUuid,
				date: todayFormat
			})
			.then(data => weeklyRankings = data.rankingUsers || [])
			.catch(e => {
				console.error(e);
				return [];
			});
	}

	function fetchMonthlyRankings() {
		UsersApi
			.getApiV1UsersRankingsItemsMonthly({
				uuid: userUuid,
				date: todayFormat
			})
			.then(data => monthlyRankings = data.rankingUsers || [])
			.catch(e => {
				console.error(e);
				return [];
			});
	}

	function fetchTotalRankings() {
		UsersApi
			.getApiV1UsersRankingsItemsOverAll({
				uuid: userUuid
			})
			.then(data => totalRankings = data.rankingUsers || [])
			.catch(e => {
				console.error(e);
				return [];
			});
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ userData?.youTubeChannelTitle } / サポートランキング"
	description="{ userData?.youTubeChannelTitle } / サポートランキング"
/>

<section>
	<div class="text-center">
		<div class="pt-3 px-4 md:(pt-6 px-5) inline-flex justify-center">
			<Tabs segmented minimum bind:value={ selectedCategory } class="inline-flex">
				<TabNav class="w-full">
					{#each days as item}
						<TabNavItem bind:value={ item.category }>{ item.label }</TabNavItem>
					{/each}
				</TabNav>
			</Tabs>
		</div>
	</div>

	{#if selectedRankings.length}
		<div class="md:vmd:hidden w-full pt-3 px-4">
			{#each selectedRankings as item}
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
			{#each lowerRankedUsers as item}
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
		<div class="pt-8 md:pt-20 text-center font-bold text-sm md:text-xl fi-text-sub">
			ランキングはありません
		</div>
	{/if}
</section>
