<script lang="ts">
	import { smaller, larger } from '$lib/stores/breakpoint';
	import Button from '$lib/components/Button';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import { Accordion, AccordionItem } from '$lib/components/Accordion';
	import {
		DistributionsApi,
		UsersApi,
		type FinggerPlatform_Server_Shared_DataTransferObjects_History_PaymentHistoryPublic as PaymentHistory,
		type FinggerPlatform_Server_Shared_DataTransferObjects_History_ItemHistoryPublic as ItemHistory,
		type FinggerPlatform_Server_Shared_DataTransferObjects_History_GiftHistoryPublic as GiftHistory,
		type FinggerPlatform_Server_Shared_DataTransferObjects_History_GachaHistoryPublic as GachaHistory
	} from '$lib/apis';
	import { channel, prepared } from '$lib/stores/user';
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import Metatags from '$lib/components/Metatags';
	import { goto } from '$app/navigation';

	const small = smaller('sm');
	const large = larger('md');

	const tabIndexCoin = 0;
	const tabIndexItem = 1;
	const tabIndexGift = 2;
	const tabIndexGacha = 3;
	const limitPerFetch = 20;

	let currentIndex = tabIndexCoin;
	let categories = [
		'コイン購入',
		'アイテム',
		'ギフト',
		'ガチャ',
	];

	let scroll:InfiniteScroll;
	let promise = Promise.resolve();
	let paymentHistories:Array<PaymentHistory & {date:string}> = [];
	let itemHistories:Array<ItemHistory & {date:string}> = [];
	let giftHistories:Array<GiftHistory & {date:string}> = [];
	let gachaHistories:Array<GachaHistory & {date:string}> = [];

	function addToPromise(f) {
			promise = promise.then(() => f());
	}

	function getDateFormat(date) {
		return format(parseISO(date), 'yyyy/MM/dd HH:mm:ss');
	}

	function fetchAnyHistories() {
		switch(currentIndex) {
			case tabIndexCoin:
				return fetchPaymentHistories();
			case tabIndexItem:
				return fetchItemHistories();
			case tabIndexGift:
				return fetchGiftHistories();
			case tabIndexGacha:
				return fetchGachaHistories();
			default:
				return void(null);
		}
	}

	function onClickAndCheckDistribution(distributionUuid) {
		DistributionsApi.getApiV1Distributions({
				uuid: distributionUuid,
				part:'youtube'
			})
			.then(data => {
				const distribution = data;
				const target = distribution.status === 'Live' ? 'streams' : 'archives';
							goto(`/${target}/${distributionUuid}`);
			})
			.catch(console.error);
	}

	async function fetchPaymentHistories(){
		return UsersApi.getApiV1UsersMeHistoriesPayments({
            limit: limitPerFetch,
            offset: paymentHistories.length
        })
		.then(data => {
			if (!data) {
				return [];
			}
			const list = data.map(item => ({
				...item,
				date: getDateFormat(item.eventAt)
			}));
			if (list.length) {
				paymentHistories = paymentHistories.concat(list);
				scroll?.validate();
			}
		})
        .catch(console.error);
	}

	function fetchItemHistories(){
		return UsersApi.getApiV1UsersMeHistoriesItems({
            limit: limitPerFetch,
            offset: itemHistories.length
        })
		.then(data => {
			if (!data) {
				return [];
			}
			const list = data.map(item => ({
				...item,
				date: getDateFormat(item.eventAt)
			}));
			if (list.length) {
				itemHistories = itemHistories.concat(list);
				scroll?.validate();
			}
		})
        .catch(console.error);
	}

	function fetchGiftHistories(){
        return UsersApi.getApiV1UsersMeHistoriesGifts({
            limit: limitPerFetch,
            offset: giftHistories.length
        })
		.then(data => {
			if (!data) {
				return [];
			}
			const list = data.map(item => ({
				...item,
				date: getDateFormat(item.eventAt)
			}));
			if (list.length) {
				giftHistories = giftHistories.concat(list);
				scroll?.validate();
			}
		})
        .catch(console.error);
	}

	function fetchGachaHistories(){
		return UsersApi.getApiV1UsersMeHistoriesGachas({
            limit: limitPerFetch,
            offset: gachaHistories.length
        })
		.then(data => {
			if (!data) {
				return [];
			}
			const list = data.map(item => ({
				...item,
				date: getDateFormat(item.eventAt)
			}));
			if (list.length) {
				gachaHistories = gachaHistories.concat(list);
				scroll?.validate();
			}
		})
        .catch(console.error);
	}
</script>

<Metatags
	useSuffix
	title="{$channel.title} / 履歴"
/>

<div class="pt-4.5 pb-6 md:py-6">
    <Tabs on:select={ () => scroll?.validate() } secondary swipe={$small} bind:value={ currentIndex }>
        <TabNav
            offsetBefore={ $small ? 16 : 0 }
            offsetAfter={ $small ? 16 : 0 }
            spaceBetween={12}
            centered={$small} class="justify-center">
            {#each categories as item, index}
                <TabNavItem value={ index }>{ item }</TabNavItem>
            {/each}
        </TabNav>
    </Tabs>
</div>

<ul class="mx-auto mb-12 table table-fixed w-full max-w-712px border-none border-t-1 border-b-1 border-base-dark border-opacity-10 bg-white dark:bg-gray-800 md:(mt-3 mb-6 rounded-lg overflow-hidden border-1 shadow-02dp)">

    <!--------------- コイン購入 ---------------->
    {#if currentIndex === tabIndexCoin}

        <li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
            <div class="table-cell align-middle text-left font-bold pl-6 md:pl-8">購入日時</div>
            <div class="table-cell align-middle text-right font-bold pr-4 md:pr-8">購入コイン</div>
        </li>

        {#if !paymentHistories.length}
            <tr class="px-8 h-13 text-md">
                <td colspan="2" class="align-middle text-center text-sm">
                    情報がありません
                </td>
            </tr>
        {/if}

        {#each paymentHistories as item}
            <li class="history-table table-row" class:selected={ false } >
                <div class="table-cell text-left pl-6 md:pl-8">{item.date}</div>
                <div class="table-cell text-right pr-4 md:pr-8">{item.amount}コイン</div>
            </li>
        {/each}

    <!--------------- アイテム使用 ---------------->
    {:else if currentIndex === tabIndexItem}

        <li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
            {#if $large}
                <div class="table-cell align-middle font-bold text-left pl-8">使用日時</div>
                <div class="table-cell align-middle font-bold text-left pl-4">タイトル名</div>
                <div class="table-cell align-middle font-bold text-left pl-4">アイテム名</div>
                <div class="table-cell align-middle font-bold text-right pr-8">動画URL</div>
            {:else}
                <div class="table-cell align-middle pl-6 pr-4">
                    <div class="flex font-bold justify-between">
                        <span>使用日時</span>
                        <span>アイテム名</span>
                    </div>
                </div>
            {/if}
        </li>

        {#if !itemHistories.length}
            <tr class="px-8 h-13 text-md">
                <td colspan="{ $large ? 4 : 1 }" class="align-middle text-center text-sm">
                    情報がありません
                </td>
            </tr>
        {/if}

        {#if $large}
            {#each itemHistories as item}
                <li class="history-table table-row" class:selected={ false } >
                    <div class="table-cell text-left pl-8">{item.date}</div>
                    <div class="table-cell text-left pl-4">{item.gameTitle}</div>
                    <div class="table-cell text-left pl-4">{item.itemName}</div>
                    <div class="table-cell text-right pr-8">
                        <Button on:click={() => onClickAndCheckDistribution(item.distributionUuid)}
                            nogutters plain rounded="full"
                            class="relative inline-flex focus:outline-none items-center justify-center">
                            <i class="icon text-2xl fingger-launch"></i>
                        </Button>
                    </div>
                </li>
            {/each}
        {:else}
            <Accordion>
                {#each itemHistories as item}
                    <AccordionItem let:expanded>
                        <!-- title -->
                        <li slot="title" class="history-table pl-6 pr-4" class:selected={ expanded } >
                            <div class="flex h-full justify-between items-center">
                                <span class="flex-shrink-0">{item.date}</span>
                                <span>{item.itemName}</span>
                            </div>
                        </li>
                        <!-- contents -->
                        <hr class="border-t-1 border-base-dark border-opacity-10" />
                        <div class="pl-8">
                            <div class="flex justify-between items-center pr-4 h-12">
                                <span class="fi-text-sub text-xs flex-shrink-0">タイトル名</span>
                                <span class="text-sm">{item.gameTitle}</span>
                            </div>
                            <hr class="border-t-1 border-base-dark border-opacity-10" />
                            <div class="flex justify-between items-center pr-4 h-12">
                                <span class="fi-text-sub text-xs flex-shrink-0">動画URL</span>
                                <Button on:click={() => onClickAndCheckDistribution(item.distributionUuid)}
                                    nogutters plain rounded="full"
                                    class="relative inline-flex focus:outline-none items-center justify-center">
                                    <i class="icon text-2xl fingger-launch"></i>
                                </Button>
                            </div>
                        </div>
                    </AccordionItem>
                {/each}
            </Accordion>
        {/if}

    <!--------------- ギフト使用 ---------------->
    {:else if currentIndex === tabIndexGift}

        <li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
            {#if $large}
                <div class="table-cell align-middle font-bold text-left pl-8">使用日時</div>
                <div class="table-cell align-middle font-bold text-left pl-4">タイトル名</div>
                <div class="table-cell align-middle font-bold text-left pl-4">ギフト名</div>
                <div class="table-cell align-middle font-bold text-right pr-8">動画URL</div>
            {:else}
                <div class="table-cell align-middle pl-6 pr-4">
                    <div class="flex font-bold justify-between">
                        <span>使用日時</span>
                        <span>ギフト名</span>
                    </div>
                </div>
            {/if}
        </li>

        {#if !giftHistories.length}
            <tr class="px-8 h-13 text-md">
                <td colspan="{ $large ? 4 : 1 }" class="align-middle text-center text-sm">
                    情報がありません
                </td>
            </tr>
        {/if}

        {#if $large}
            {#each giftHistories as item}
                <li class="history-table table-row" class:selected={ false } >
                    <div class="table-cell text-left pl-8">{item.date}</div>
                    <div class="table-cell text-left pl-4">{item.gameTitle}</div>
                    <div class="table-cell text-left pl-4">{item.giftName}</div>
                    <div class="table-cell text-right pr-8">
                        <Button on:click={() => onClickAndCheckDistribution(item.distributionUuid)}
                            nogutters plain rounded="full"
                            class="relative inline-flex focus:outline-none items-center justify-center">
                            <i class="icon text-2xl fingger-launch"></i>
                        </Button>
                    </div>
                </li>
            {/each}
        {:else}
            <Accordion>
                {#each giftHistories as item}
                    <AccordionItem let:expanded>
                        <!-- title -->
                        <li slot="title" class="history-table pl-6 pr-4" class:selected={ expanded } >
                            <div class="flex h-full justify-between items-center">
                                <span class="flex-shrink-0">{item.date}</span>
                                <span>{item.giftName}</span>
                            </div>
                        </li>
                        <!-- contents -->
                        <hr class="border-t-1 border-base-dark border-opacity-10" />
                        <div class="pl-8">
                            <div class="flex justify-between items-center pr-4 h-12">
                                <span class="fi-text-sub text-xs flex-shrink-0">タイトル名</span>
                                <span class="text-sm">{item.gameTitle}</span>
                            </div>
                            <hr class="border-t-1 border-base-dark border-opacity-10" />
                            <div class="flex justify-between items-center pr-4 h-12">
                                <span class="fi-text-sub text-xs flex-shrink-0">動画URL</span>
                                <Button on:click={() => onClickAndCheckDistribution(item.distributionUuid)}
                                    nogutters plain rounded="full"
                                    class="relative inline-flex focus:outline-none items-center justify-center">
                                    <i class="icon text-2xl fingger-launch"></i>
                                </Button>
                            </div>
                        </div>
                    </AccordionItem>
                {/each}
            </Accordion>
        {/if}

    <!--------------- ガチャ実行 ---------------->
    {:else if currentIndex === tabIndexGacha}

        <li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
            {#if $large}
                <div class="table-cell align-middle font-bold text-left pl-8">実行日時</div>
                <div class="table-cell align-middle font-bold text-left pl-4">タイトル名</div>
                <div class="table-cell align-middle font-bold text-left pl-4">ガチャ名称</div>
                <div class="table-cell align-middle font-bold text-right pr-8">消費コイン</div>
            {:else}
                <div class="table-cell align-middle pl-6 pr-4">
                    <div class="flex font-bold justify-between">
                        <span>実行日時</span>
                        <span>消費コイン</span>
                    </div>
                </div>
            {/if}
        </li>

        {#if !gachaHistories.length}
            <tr class="px-8 h-13 text-md">
                <td colspan="{ $large ? 4 : 1 }" class="align-middle text-center text-sm">
                    情報がありません
                </td>
            </tr>
        {/if}

        {#if $large}
            {#each gachaHistories as item}
                <li class="history-table table-row" class:selected={ false } >
                    <div class="table-cell text-left pl-8">{item.date}</div>
                    <div class="table-cell text-left pl-4">{item.gameTitle}</div>
                    <div class="table-cell text-left pl-4">{item.gachaName}</div>
                    <div class="table-cell text-right pr-8">{item.price}コイン</div>
                </li>
            {/each}
        {:else}
            <Accordion>
                {#each gachaHistories as item}
                    <AccordionItem let:expanded>
                        <!-- title -->
                        <li slot="title" class="history-table pl-6 pr-4" class:selected={ expanded } >
                            <div class="flex h-full justify-between items-center">
                                <span class="flex-shrink-0">{item.date}</span>
                                <span>{item.price}コイン</span>
                            </div>
                        </li>
                        <!-- contents -->
                        <hr class="border-t-1 border-base-dark border-opacity-10" />
                        <div class="pl-8">
                            <div class="flex justify-between items-center pr-4 h-12">
                                <span class="fi-text-sub text-xs flex-shrink-0">タイトル名</span>
                                <span class="text-sm">{item.gameTitle}</span>
                            </div>
                            <hr class="border-t-1 border-base-dark border-opacity-10" />
                            <div class="flex justify-between items-center pr-4 h-12">
                                <span class="fi-text-sub text-xs flex-shrink-0">ガチャ名称</span>
                                <span class="text-sm">{item.gachaName}</span>
                            </div>
                        </div>
                    </AccordionItem>
                {/each}
            </Accordion>

        {/if}

    {/if}
</ul>

<InfiniteScroll
    active={ $prepared }
    bind:this={ scroll }
    on:more={ () => addToPromise(fetchAnyHistories) }
/>

<style>
    /* イテレートで回すところは共通のスタイルだけクラスで指定する */
    .history-table {
        @apply h-13 text-sm border-t-1;
    }
    .history-table > .table-cell {
        @apply align-middle border-t-1 border-base-dark border-opacity-10 text-sm;
    }
    .history-table.selected {
        @apply bg-teal-600 bg-opacity-8 transition duration-150;
    }
</style>
