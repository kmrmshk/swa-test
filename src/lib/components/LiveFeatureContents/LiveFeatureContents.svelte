<script context="module">
	export const TabOverview = { name: '概要', value: 'Overview' };
	export const TabItems = { name: 'アイテム', value: 'Items' };
	export const TabDistribution = { name: '配信', value: 'Distributions' };
	export const TabArchives = { name: '配信', value: 'Archives' };
	export const TabComment = { name: 'コメント', value: 'Comments' };
	export const TabRanking = { name: 'サポートランキング', value: 'Ranking' };
	export const TabGift = { name: 'ギフト', value: 'Gift' };
</script>

<script>
	import DistributionDescription from './DistributionDescription.svelte';
	import GachaItemList from './GachaItemList.svelte';
	import GameDistributionList from './GameDistributionList.svelte';
	import DistributorArchiveList from './DistributorArchiveList.svelte';
	import GachaBox from '$lib/components/GachaBox';
	import GiftBox from '$lib/components/GiftBox';
	import { LoginNavigator } from '$lib/components/Login';
	import { prepared } from '$lib/stores/user';
	import { mobile } from '$lib/stores/device';
	import { larger } from '$lib/stores/breakpoint';

	const large = larger('md');
	const gachaBreakpoints = {
		600: { slidesPerView: 1, slidesPerGroup: 1 },
		800: { slidesPerView: 2, slidesPerGroup: 2 },
		1158: { slidesPerView: 3, slidesPerGroup: 3 },
		1336: { slidesPerView: 4, slidesPerGroup: 4 },
		1680: { slidesPerView: 5, slidesPerGroup: 5 },
		1920: { slidesPerView: 6, slidesPerGroup: 6 },
	};

	export let mode = '';
	export let list = [];
	export let description = '';
	export let distributionUuid = '';
	export let bundleId = '';
	export let distributorUuid = '';
	export let isGiftEnable = false;
	export let isGiftEffectEnable = false;
	export let tags = [];

	$: asBroadPC = !$mobile && $large;
	$: if( ! list.some( ({value}) => value === mode ) ){
		mode = list[0].value;
	}
</script>

{#key mode}
	{#if mode === TabComment.value}
		<slot name="comments" />
	{:else if mode === TabRanking.value}
		<slot name="ranking" />
	{:else}
		<div class="{asBroadPC ? '':'absolute top-49px bottom-0 overflow-y-auto w-full'}">
			{#if mode === TabOverview.value} <!-- 概要を表示 -->
				<DistributionDescription {description} {tags} />
			{:else if mode === TabItems.value} <!-- ガチャを表示 -->
				{#if $prepared}
					<div class="{asBroadPC ? '':'px-4 py-2'}">
						<h5 class="{asBroadPC ? 'pb-2 pl-2 text-xl font-bold':'pb-1'}">アイテム</h5>
						<GachaItemList {bundleId} streamUuid={distributionUuid} asCarousel={asBroadPC} />
						<h5 class="pt-6 {asBroadPC ? 'pb-2 pl-2 text-xl font-bold':'pb-1'}">ガチャ</h5>
						<GachaBox {bundleId} {distributionUuid} breakpoints={gachaBreakpoints} />
					</div>
				{:else}
					<LoginNavigator class="px-10 py-10">
						ログインするとガチャ、アイテムが使用できるようになります
					</LoginNavigator>
				{/if}
			{:else if mode === TabDistribution.value} <!-- 配信を表示 -->
				<div class="{asBroadPC ? 'pt-1':'pt-5'} px-7 pb-7">
					{#if asBroadPC}
						<h5 class="pb-1 md:(pb-2 text-xl font-bold)">人気の配信</h5>
					{/if}
					<GameDistributionList {bundleId} {distributionUuid} autoplay={ false }
						gridOptions="{ asBroadPC ? 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3':''}"/>
				</div>
			{:else if mode === TabArchives.value} <!-- アーカイブでの配信を表示 -->
				<div class="{asBroadPC ? 'pt-1':'pt-5'}">
					{#if asBroadPC}
						<h5 class="py-1 px-7 md:(pb-2 text-xl font-bold)">最新の配信</h5>
					{/if}
					<DistributorArchiveList {distributorUuid} archiveUuid={distributionUuid}
						gridOptions="{ asBroadPC ? 'sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3':''}"/>
				</div>
			{:else if mode === TabGift.value} <!-- ギフトを表示 -->
				{#if $prepared}
					<div class="{asBroadPC ? '':'px-2 py-2'}">
						<GiftBox {distributionUuid} {isGiftEnable} {isGiftEffectEnable} />
					</div>
				{:else}
					<LoginNavigator class="px-10 py-10">
						ログインするとギフトが使用できるようになります
					</LoginNavigator>
				{/if}
			{/if}
		</div>
	{/if}
{/key}