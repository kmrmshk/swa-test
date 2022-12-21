<script lang="ts">
	import { goto } from '$app/navigation';
	import { larger } from '$lib/stores/breakpoint';
	import find from 'lodash/find';
	import get from 'lodash/get';
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import {
		userCurrencies,
		channel,
		prepared,
		exchangeable,
		remainingExchangeableDays,
		bankAccounts,
		asMember,
		fetchUser
	} from '$lib/stores/user';
	import { UsersApi, BankAccountsApi } from '$lib/apis';

	import Card from '$lib/components/Card';
	import Metatags from '$lib/components/Metatags';
	import { Accordion, AccordionItem } from '$lib/components/Accordion';
	import Button from '$lib/components/Button';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import Modal from '$lib/components/Modal';
	import BankAccountRegisterModal from '$lib/components/BankAccountRegisterModal';
	import Loading from '$lib/components/Loading';
	import ActivateModalSet, { checkActivated } from '$lib/components/ActivateModalSet';
	import type {FinggerPlatform_Server_Shared_DataTransferObjects_History_UserWithdrawalHistoryPublic as History} from '$lib/apis';
	import type { BankAccount } from '$lib/stores/user';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

	let diamondAmount = 0;
	let scroll:InfiniteScroll;
	let hasMoreItems = true;

	let bankAccountModalActive = false;
	let bankAccountModal:BankAccountRegisterModal;
	let bankAccountPromise:Promise<void>|null = null;
	let activateModal = false;

	const large = larger('md');
	const externalLink = import.meta.env.url_exchange_faq || '';
	const limit = 10;
	const cautions = [
		'※換金申請には口座情報の登録が必要です',
		'※1,000ダイヤ以上から申請が可能です。自動振込は1,000ダイヤ以上所持している場合のみ実行されます',
		'※一度に換金可能なダイヤは450,000ダイヤまでです',
		'※ダイヤの換金期限は1,000ダイヤに到達した日から180日後までとなります。それ以降はゲームプレイが行えなくなります',
		'※自動振込口座を設定すると毎月末日の正午に自動でダイヤが換金され設定口座に振り込まれます',
		'※毎月末日11:50〜13:00の時間のみ換金、振込指定口座の追加、編集、削除処理は行えなくなります',
	];
	const bankTypes:{[key:string|number]: string} = {
		1: '普通',
		2: '当座',
	}

	let histories:Array<History> = [];
	let bankDeleteModal = false;
	let selectedBank:BankAccount | null;
	let intervalId = -1;
	let processing = false;

	function openBankAccountModal(data:BankAccount|null) {
		bankAccountModal.reset();
		if(data) {
			bankAccountModal.setData(data);
		}
		bankAccountModalActive = true;
	}

	async function fetchUserStatus() {
		await fetchUser();
		await fetchWithdrawalStatus();
		const diamond = find($userCurrencies, {currencyType: 'Diamond'});
		diamondAmount = get(diamond, 'amount', 0);
		if( bankAccountPromise === null ){
			bankAccountPromise = bankAccounts.fetch();
		}
	}

	function startInterval(initializing = false) {
		if(!browser) return;
		stopInterval();
		intervalId = window.setInterval(fetchUserStatus, 60000);
		if(initializing) {
			fetchUserStatus();
		}
	}

	function stopInterval() {
		if(!browser) return;
		window.clearInterval(intervalId);
	}

	function toJPY(price:number) {
		return price.toLocaleString('ja-JP', {
			style: 'currency',
			currency: 'JPY',
		});
	}

	function getDateFormat(date:string) {
		return format(parseISO(date), 'yyyy/MM/dd HH:mm');
	}

	function fetchWithdrawalStatus() {
		return BankAccountsApi.getApiV1BankAccountsMeWithdrawalStatus()
			.then(data => {
				switch(data?.status ?? '') {
					case 'Ready':
					case 'Processing':
						processing = true;
						break;
					default:
						processing = false;
				}
			});
	}

	function fetchHistories() {
		UsersApi
			.getApiV1UsersMeHistoriesWithdrawals({
				limit,
				offset: histories.length
			})
			.then(data => {
				histories = histories.concat(data ?? []);
				if (data?.length) {
					scroll?.validate();
				} else {
					hasMoreItems = false;
				}
			})
			.catch(console.error);
	}

	function onClickedBankDeleteButton(index:number){
		selectedBank = $bankAccounts[index];
		bankDeleteModal = true;
	}

	function onClickedBankDeleteModalAcceptButton(){
		BankAccountsApi
			.deleteApiV1BankAccounts({
				bankAccountUuid: selectedBank?.uuid ?? ''
			})
			.then(_ => {
				bankAccountPromise = bankAccounts.fetch();
				bankDeleteModal = false;
			})
			.catch(console.error);
	}

	async function onClickedExchange(){
		if( await checkActivated() ){
			activateModal = true;
			return;
		}
		goto('/my/diamond/exchange');
	}

	onDestroy(() => {
		stopInterval();
	});

	$: if ($prepared){
		startInterval(true);
	}
</script>

<Metatags
	useSuffix
	title="{$channel.title} / ダイヤ"
/>

{#if $asMember}
	<div class="pt-9 md:pt-19 text-center font-bold text-sm text-error-dark md:text-xl">
		ダイヤは組織アカウントによって<br class="<sm:inline md:hidden">管理されています
	</div>
{:else}
	<div class="flex justify-center px-6">
		<Card class="fi-border mt-6 w-full max-w-530px bg-white dark:bg-gray-900 border-1 shadow-02dp text-left">
			<h4 class="pl-7 md:pl-4 pt-6 text-sm md:(pl-13 pt-8 text-base)">持っているダイヤ</h4>
			<div class="mt-3 pl-5 md:pl-4 pb-4 md:(pl-10 pb-8) flex items-end">
				<img class="md:mb-1" src="/assets/images/icons/icon-gem.svg" alt="diamond"/>
				<h5 class="inline-block ml-5 text-2xl md:(text-4xl) font-light leading-none">{ diamondAmount.toLocaleString() }</h5>
			</div>
			<hr class="mx-3">
			<div class="py-4 px-6 text-xs">
				{#if $exchangeable}
					<p class="text-error-dark">
						{#if $remainingExchangeableDays >= 0}
							ダイヤの換金期限が残り{ $remainingExchangeableDays }日です。期限を過ぎるとゲームプレイが行えなくなります
						{:else}
							ダイヤの換金期限が過ぎています。現在ゲームプレイを行えなくなっています。ダイヤを換金してください。
						{/if}
					</p>
				{/if}
				<ul class:mt-1={ $exchangeable }>
					{#each cautions as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
			<div class="flex h-13 px-6 pb-4 justify-end">
				<Button text class="px-4 inline-flex items-center text-sm"
					on:click={ () => browser && window.open(externalLink, '_blank') }>
					よくある質問
				</Button>
				<Button on:click={ onClickedExchange } disabled={ !$exchangeable || !$bankAccounts.length || processing }
					class="ml-7 px-4 inline-flex items-center text-sm">
					換金申請する
				</Button>
			</div>
		</Card>
	</div>

	<div class="mt-6 px-6">
		<div class="flex items-center max-w-530px m-auto mb-2 min-h-9">
			<h4 class="text-sm md:text-lg font-bold pr-4 fi-text-sub">口座情報</h4>
			<p class="text-xs md:text-sm flex-grow">５つまで登録できます</p>
			{#await bankAccountPromise then _}
				{#if $bankAccounts.length < 5 && !processing}
					<Button text outlined small on:click={ () => openBankAccountModal(null) } >追加</Button>
				{/if}
			{/await}
		</div>
		<ul class="max-w-530px m-auto">
			{#each $bankAccounts as item, index}
				<li class:auto-transfer={item?.isAutoTransfer} class="mt-4 relative md:flex items-center fi-border w-full pt-4 md:pb-4 px-6 pr-3 rounded-lg bg-white dark:bg-gray-900 border-1 shadow-02dp">
					{#if item?.isAutoTransfer}
						<span class="px-4 absolute -top-3 left-4 leading-6 text-xs rounded-xl text-white bg-primary-light">自動振込</span>
					{/if}
					<div class="flex-grow text-sm pr-3">{item?.bankName}</div>
					{#if !processing}
						<div class="text-right min-w-34">
							<Button text small on:click={ () => openBankAccountModal(item) }>編集</Button>
							<Button on:click={ () => onClickedBankDeleteButton(index) } text small >削除</Button>
						</div>
					{/if}
				</li>
			{:else}
				{#await bankAccountPromise}
				<li>
					<div class="w-6 m-auto">
						<Loading light="#666" dark="#999" size={24} />
					</div>
				</li>
				{:then _}
					<li class="fi-border w-full py-4 px-6 rounded-lg text-error-dark bg-white dark:bg-gray-900 border-1 shadow-02dp">
						{#if !processing}
							口座情報を登録してください
						{/if}
					</li>
				{/await}
			{/each}
		</ul>
	</div>


	<ul class="mx-auto mt-4 mb-12 table table-fixed w-full max-w-712px border-none border-t-1 border-b-1 border-base-dark border-opacity-10 bg-white dark:bg-gray-800 md:(mt-6 mb-6 rounded-lg overflow-hidden border-1 shadow-02dp)">
		<li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
			{#if $large}
				<div class="table-cell align-middle w-3/10 font-bold text-left pl-4 lg:pl-8">申請日時</div>
				<div class="table-cell align-middle w-3.5/10 font-bold text-left pl-4">振込額</div>
				<div class="table-cell align-middle w-3.5/10 font-bold text-left pl-4 pr-4 lg:pr-8">換金詳細</div>
			{:else}
				<div class="table-cell align-middle pl-6 pr-4">
					<div class="flex font-bold justify-between">
						<span>申請日時</span>
						<span>振込額</span>
					</div>
				</div>
			{/if}
		</li>

		{#if !histories.length}
			<li class="table-row px-8 h-13 text-md">
				<td colspan="{ $large ? 3 : 1 }" class="align-middle text-center text-sm">
					換金情報がありません
				</td>
			</li>
		{/if}

		{#if $large}
			{#each histories as item, index}
				<li class="history-table table-row" class:selected={ false }>
					<div class="fi-lb table-cell text-left p-4 lg:pl-8 text-sm align-top">
						{ getDateFormat(item.createdAt) }
					</div>
					<div class="table-cell text-left p-4 text-sm align-top">
						{ toJPY(item.transferAmount) }
					</div>
					<div class="table-cell text-center p-4 lg:pr-8 align-top">
						<table class="w-full">
							<tr>
								<td class="text-left align-top">報酬申請額</td>
								<td class="text-right">{ toJPY(item.useDiamond) }</td>
							</tr>
							<tr>
								<td class="text-left align-top">消費税</td>
								<td class="text-right">{ toJPY(item.consumptionTax) }</td>
							</tr>
							<tr>
								<td class="text-left align-top">源泉所得税</td>
								<td class="text-right">{ toJPY(item.incomeTax) }</td>
							</tr>
							<tr>
								<td class="text-left align-top">決済手数料</td>
								<td class="text-right">{ toJPY(item.commission) }</td>
							</tr>
						</table>
					</div>
				</li>
			{/each}
		{:else}
			<Accordion>
				{#each histories as item, index}
					<AccordionItem let:expanded>
						<li slot="title" class="history-table py-3 pl-6 pr-4" class:selected={ expanded }>
							<div class="flex h-full justify-between items-center">
								<span class="flex-shrink-0 text-sm">{ getDateFormat(item.createdAt) }</span>
								<span class="flex-shrink-0 text-sm pr-2">{ toJPY(item.transferAmount) }</span>
							</div>
						</li>
						<hr class="border-t-1 border-base-dark border-opacity-10"/>
						<div class="pl-8">
							<div class="flex justify-between items-center pr-4 h-12">
								<span class="fi-text-sub text-xs flex-shrink-0">報酬申請額</span>
								<span class="text-sm">{ toJPY(item.useDiamond) }</span>
							</div>
							<hr class="border-t-1 border-base-dark border-opacity-10"/>
							<div class="flex justify-between items-center pr-4 h-12">
								<span class="fi-text-sub text-xs flex-shrink-0">消費税</span>
								<span class="text-sm">{ toJPY(item.consumptionTax) }</span>
							</div>
							<hr class="border-t-1 border-base-dark border-opacity-10"/>
							<div class="flex justify-between items-center pr-4 h-12">
								<span class="fi-text-sub text-xs flex-shrink-0">源泉所得税</span>
								<span class="text-sm">{ toJPY(item.incomeTax) }</span>
							</div>
							<hr class="border-t-1 border-base-dark border-opacity-10"/>
							<div class="flex justify-between items-center pr-4 h-12">
								<span class="fi-text-sub text-xs flex-shrink-0">決済手数料</span>
								<span class="text-sm">{ toJPY(item.commission) }</span>
							</div>
						</div>
					</AccordionItem>
				{/each}
			</Accordion>
		{/if}
	</ul>
	<InfiniteScroll
		bind:this={ scroll }
		active={ $prepared && hasMoreItems }
		on:more={ fetchHistories }
	/>
{/if}

<!-- 口座削除モーダル -->
<Modal bind:active={ bankDeleteModal } closeable={false} fill
	on:accept={ onClickedBankDeleteModalAcceptButton }
	class="w-150 rounded-lg">
	<h4 class="w-full pt-4 pb-3 pl-4 text-sm font-bold md:(pt-8 pb-5 pr-0 text-2xl text-center font-normal) border-b-1 border-base-dark border-opacity-10">
		口座情報削除
	</h4>
	<ul class="modal-bank-info">
		<li>
			<div class="title">銀行名</div>
			<div>{selectedBank?.bankName}</div>
		</li>
		<li>
			<div class="title">支店コード</div>
			<div>{selectedBank?.branchCode}</div>
		</li>
		<li>
			<div class="title">預金種目</div>
			<div>{bankTypes[selectedBank?.accountType ?? 1]}</div>
		</li>
		<li>
			<div class="title">口座番号</div>
			<div>{selectedBank?.accountNumber}</div>
		</li>
		<li>
			<div class="title">口座名義人</div>
			<div>{selectedBank?.accountName}</div>
		</li>
	</ul>
	<p class="p-6 text-sm text-center border-b-1 border-base-dark border-opacity-10">
		上記の口座登録を削除してもよろしいですか？
	</p>
	<div class="py-8 text-center">
		<Button on:click={()=>bankDeleteModal = false} text small>キャンセル</Button>
		<Button on:click={onClickedBankDeleteModalAcceptButton} small >削除</Button>
	</div>
</Modal>

<!-- 口座登録・編集モーダル -->
<BankAccountRegisterModal
	bind:this={ bankAccountModal }
	bind:active={ bankAccountModalActive }
	on:success={ () => bankAccountPromise = bankAccounts.fetch() }
/>

<!-- 配信アクティベート -->
<ActivateModalSet bind:active={activateModal} />

<style>
	.auto-transfer {
		@apply border-primary-light border-2;
	}

	:global(.dark) .auto-transfer {
		@apply border-primary-light;
	}

	/* イテレートで回すところは共通のスタイルだけクラスで指定する */
	.history-table {
		@apply h-13 text-sm border-t-1;
	}

	.history-table > .table-cell {
		@apply border-t-1 border-base-dark border-opacity-10 text-sm;
	}

	.history-table.selected {
		@apply bg-teal-600 bg-opacity-8 transition duration-150;
	}

	.modal-bank-info {
		@apply md:mt-12 mt-6;
	}

	.modal-bank-info > li {
		@apply mb-3 pl-4 md:(flex mb-8 pl-0);
	}

	.modal-bank-info > li > .title {
		@apply w-40 text-xs font-bold text-opacity-60 text-base-dark md:(text-right mr-10 text-sm);
	}

	:global(.dark) .modal-bank-info > li > .title{
		@apply text-white text-opacity-60;
	}
</style>
