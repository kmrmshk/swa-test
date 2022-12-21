<script lang="ts">
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import intervalToDuration from 'date-fns/intervalToDuration/index.js';
	import endOfMonth from 'date-fns/endOfMonth/index.js';
	import startOfMonth from 'date-fns/startOfMonth/index.js';
	import subMonths from 'date-fns/subMonths/index.js';
	import { larger } from '$lib/stores/breakpoint';
	import TabNav from '$lib/components/Tabs/TabNav.svelte';
	import TabNavItem from '$lib/components/Tabs/TabNavItem.svelte';
	import { AccordionItem, Accordion } from '$lib/components/Accordion';
	import Tabs from '$lib/components/Tabs/Tabs.svelte';
	import Card from '$lib/components/Card';
	import {UsersApi} from '$lib/apis';
	import {channel, prepared} from '$lib/stores/user';
	import orderBy from 'lodash/orderBy';
	import groupBy from 'lodash/groupBy';
	import sumBy from 'lodash/sumBy';
	import Metatags from '$lib/components/Metatags';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionDailyStatisticPublic as DailyStatistic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Statistic_UserDistributionMonthlyStatisticPublic as MonthlyStatistic
	} from '$lib/apis';

	type DailyStatisticGroup = {
		[id: string]: Array<never> | Array<DailyStatistic>;
	}
	type MonthlyStatisticGroup = {
		[id: string]: Array<never> | Array<DailyStatistic>;
	}

	const large = larger('md');

	const categoryPlaytime = {
		key: 'Playtime',
		icon: 'fingger-gamepad',
		label: 'プレイ時間(h)',
	};
	const categoryAudience = {
		key: 'Audience',
		icon: 'fingger-face',
		label: '視聴回数',
	};
	const categoryViewingTime = {
		key: 'ViewingTime',
		icon: 'fingger-timer',
		label: '視聴時間(h)',
	};
	const categoryCommentUsersNum = {
		key: 'CommentUsersNum',
		icon: 'fingger-human-balloon',
		label: 'コメント人数',
	};
	const categoryCommentsNum = {
		key: 'CommentsNum',
		icon: 'fingger-speech-balloon',
		label: 'コメント数',
	};
	const categoryPeopleUsingItemsNum = {
		key: 'PeopleUsingItemsNum',
		icon: 'fingger-human-bag',
		label: 'アイテム使用人数',
	};
	const categoryUsedItemsNum = {
		key: 'UsedItemsNum',
		icon: 'fingger-bag',
		label: 'アイテム総額',
	};
	const categoryPeopleUsingGiftsNum = {
		key: 'PeopleUsingGiftsNum',
		icon: 'fingger-human-gift',
		label: 'ギフト使用人数',
	};
	const categoryUsedGiftsNum = {
		key: 'UsedGiftsNum',
		icon: 'fingger-gift',
		label: 'ギフト総額',
	};

	let dailyStatisticsGroup:DailyStatisticGroup = {};
	let monthlyStatisticsGroup:MonthlyStatisticGroup = {};
	let dailyDistributions:Array<DailyStatistic> = [];
	let monthlyDistributions:Array<MonthlyStatistic> = [];
	let monthly:Array<string> = [];

	$: allDataSet = [
		categoryPlaytime,
		categoryAudience,
		// categoryViewingTime,
		categoryCommentUsersNum,
		categoryCommentsNum,
		categoryPeopleUsingItemsNum,
		categoryUsedItemsNum,
		categoryPeopleUsingGiftsNum,
		categoryUsedGiftsNum,
	];

	$: categories = $large
		? [
			categoryCommentUsersNum,
			categoryCommentsNum,
			categoryPeopleUsingItemsNum,
			categoryUsedItemsNum,
			categoryPeopleUsingGiftsNum,
			categoryUsedGiftsNum,
		]
		: [
			categoryAudience,
			categoryCommentUsersNum,
			categoryCommentsNum,
			categoryPeopleUsingItemsNum,
			categoryUsedItemsNum,
			categoryPeopleUsingGiftsNum,
			categoryUsedGiftsNum,
		];

	const today = new Date;
	const startMonth = startOfMonth(today);
	const startMonthDay = subMonths(startMonth, 11); //過去1年間を表示
	const endMonthDay = endOfMonth(today);

	$: if($prepared) {
		fetchMonthlyStatistics(startMonthDay, endMonthDay)
	}

	function toDateFormat(date) {
		return format(date, 'yyyy-MM-dd')
	}

	function toMonthFormat(month){
		return format(parseISO(month), 'yyyy/MM');
	}

	function fetchDailyStatistics(startMonthDay, endMonthDay){
		return UsersApi.getApiV1UsersMeStatisticsDaily({
			fromDate: toDateFormat(startMonthDay),
			toDate: toDateFormat(endMonthDay)
		})
			.then(data => {
				if (!data) {
					return [];
				}
				return data;
			})
			.catch(e => {
				console.error(e);
				return [];
			});;
	}

	function fetchMonthlyStatistics(startMonthDay, endMonthDay){
		return UsersApi.getApiV1UsersMeStatisticsMonthly({
			fromDate: toDateFormat(startMonthDay),
			toDate: toDateFormat(endMonthDay)
		})
			.then(data => {
				if (!data || !data.length) {
					return;
				}
				const monthlyStatistics = orderBy(data, [ 'month' ], [ 'desc' ]);
				monthlyStatisticsGroup = groupBy(monthlyStatistics, distribution => distribution.month.substring(0, 7));

				// ナビ用の月
				monthly = Object.keys(monthlyStatisticsGroup);
				// 最初の月をセット
				changeMonth(monthly[0]);
			})
			.catch(console.error);
	}

	async function changeMonth(month){
		monthlyDistributions = monthlyStatisticsGroup[month];
		// Daily
		if(typeof dailyStatisticsGroup[month] == 'undefined'){
			const baseDate = new Date(month + '-01');
			const startMonthDay = startOfMonth(baseDate);
			const endMonthDay = endOfMonth(baseDate);
			const dailyStatistic = await fetchDailyStatistics(startMonthDay, endMonthDay);
			if(dailyStatistic.length > 0){
				dailyStatisticsGroup[month] = dailyStatistic;
			} else {
				dailyDistributions = [];
			}
		}
		dailyDistributions = dailyStatisticsGroup[month];
	}

	function totalPlaytime(distributions) {
		const totalMilliSeconds = sumBy(distributions, 'durationSeconds') * 1000;
		const { days, hours, minutes, seconds } = intervalToDuration({ start: 0, end: totalMilliSeconds });
		return [`${(hours + days * 24)}`.padStart(2, '0'), `${minutes}`.padStart(2, '0')].join('.');
	}

	function startAt(distribution) {
		const pattern = $large ? 'yyyy/MM/dd' : 'MM/dd';
		return format(parseISO(distribution.date), pattern);
	}

	function playTime(distribution) {
		const durationMilliSeconds = distribution.durationSeconds * 1000;
		const { days, hours, minutes, seconds } = intervalToDuration({ start: 0, end: durationMilliSeconds });
		return [`${(hours + days * 24)}`.padStart(2, '0'), `${minutes}`.padStart(2, '0'), `${seconds}`.padStart(2, '0')].join(':');
	}

	$: totalList = {
		Playtime: totalPlaytime(monthlyDistributions),
		Audience: sumBy(monthlyDistributions, 'viewCount').toLocaleString(),
		CommentUsersNum: sumBy(monthlyDistributions, 'commentedUserCount').toLocaleString(),
		CommentsNum: sumBy(monthlyDistributions, 'commentCount').toLocaleString(),
		PeopleUsingItemsNum: sumBy(monthlyDistributions, 'itemUsedUserCount').toLocaleString(),
		UsedItemsNum: sumBy(monthlyDistributions, 'usedItemTotalPrice').toLocaleString(),
		PeopleUsingGiftsNum: sumBy(monthlyDistributions, 'giftUsedUserCount').toLocaleString(),
		UsedGiftsNum: sumBy(monthlyDistributions, 'usedGiftTotalPrice').toLocaleString(),
	};

	$: distributionList = dailyDistributions.map(function (distribution) {
		return {
			startAt: startAt(distribution),
			playTime: playTime(distribution),
			Audience: distribution.viewCount.toLocaleString(),
			CommentUsersNum: distribution.commentedUserCount.toLocaleString(),
			CommentsNum: distribution.commentCount.toLocaleString(),
			PeopleUsingItemsNum: distribution.itemUsedUserCount.toLocaleString(),
			UsedItemsNum: distribution.usedItemTotalPrice.toLocaleString(),
			PeopleUsingGiftsNum: distribution.giftUsedUserCount.toLocaleString(),
			UsedGiftsNum: distribution.usedGiftTotalPrice.toLocaleString(),
		}
	});
</script>

<Metatags
	useSuffix
	title="{$channel.title} / 配信データ"
/>

<div class="pt-4.5 md:pt-6">
	<Tabs secondary swipe class="min-h-9">
		<TabNav spaceBetween={12} centered offsetBefore={$large ? 24 : 16} offsetAfter={$large ? 24 : 16}>
			{#each monthly as month}
				<TabNavItem on:click={changeMonth(month)}>{toMonthFormat(month)}</TabNavItem>
			{/each}
		</TabNav>
	</Tabs>
</div>

<h2 class="fi-text-sub mt-4.5 md:mt-7 px-4 md:px-6 text-base md:text-xl">全体データ</h2>
<div class="mx-auto mt-2 px-4 md:px-6 grid grid-cols-2 xl:grid-cols-3 gap-3 max-w-screen-xl">
	{#each allDataSet as item, index}
		<Card class="fi-border px-4 py-3 bg-white dark:bg-gray-900 border-1 rounded-lg shadow-02dp">
			<div class="flex items-center justify-start">
				<i class="text-2xl icon {item.icon}" />
				<div class="ml-3">
					<h4 class="fi-text-sub text-xs">{item.label}</h4>
					<span>{ totalList[item.key] }</span>
				</div>
			</div>
		</Card>
	{/each}
</div>

<h2 class="fi-text-sub text-base md:text-xl mt-6 px-4 md:px-6">1日の詳細データ</h2>


<div class="mt-2 mb-12 md:mb-6 md:px-6">
	<ul class="mx-auto w-full bg-white dark:bg-gray-900 md:(mt-3 rounded-lg shadow-02dp overflow-hidden)">
		<li class="fi-text-sub flex items-center justify-between h-56px bg-gray-300 dark:bg-gray-800 border-none border-b-1 md:border-1 border-base-dark border-opacity-10 text-sm">
			<h3 class="flex-grow text-left font-bold pl-6 md:pl-21">日付</h3>
			<h3 class="text-right font-bold min-w-30 pr-8">プレイ時間</h3>
			<h3 class="<md:hidden text-right font-bold min-w-32 pr-8">視聴回数</h3>
			<!-- <h3 class="text-right min-w-30 pr-4 md:pr-8">視聴時間(Min)</h3> -->
		</li>
		<Accordion>
			{#each distributionList as distribution }
				<AccordionItem let:expanded>
					<!-- Accordion title -->
					<div slot="title"
						class="accordion-title flex items-center h-13 border-t-1 border-base-dark border-opacity-10"
						class:selected={ expanded } >
						<div class="<md:hidden text-left pl-6 text-2xl">
							<i class="inline-block icon fingger-arrow-right transition duration-250 transform origin-center {expanded ? 'rotate-90' : ''}" />
						</div>
						<div class="flex-grow text-left text-sm md:ml-9 pl-6 md:pl-0 pr-8">{ distribution['startAt'] }</div>
						<div class="flex-shrink-0 min-w-30 text-sm text-right pr-8">{ distribution['playTime'] }</div>
						<div class="<md:hidden flex-shrink-0 min-w-32 text-sm text-right pr-8">{ distribution['Audience'] }</div>
						<!-- <div class="flex-shrink-0 min-w-30 text-sm text-right pr-4 md:pr-8">{ '240' }</div> -->
					</div>
					<!-- Accordion content -->
					<hr class="border-t-1 border-base-dark border-opacity-10" />
					<div class="pl-8 md:pl-78px md:pr-2 w-full">
						{#each categories as item, i}
							<div class="accordion-content py-2 md:pl-4 flex min-h-12 items-center not-first:border-t-1 border-base-dark border-opacity-10 md:border-none">
								<i class="text-2xl icon {item.icon}" />
								<div class="flex flex-grow w-full items-center justify-between px-4 md:(flex-col self-start items-start justify-start pl-3 pr-0 flex-grow-0)">
									<h4 class="fi-text-sub text-xs">{item.label}</h4>
									<span class="text-sm">{ distribution[item.key] }</span>
									<hr class="<md:hidden mt-2 border-t-1 w-full border-base-dark border-opacity-10" />
								</div>
							</div>
						{/each}
					</div>
				</AccordionItem>
			{/each}
		</Accordion>
	</ul>
</div>

<style>
	.accordion-title.selected {
		@apply bg-teal-600 bg-opacity-10 transition duration-150;
	}
	.accordion-content:last-child hr{
		display: none;
	}
</style>
