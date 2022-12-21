<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import find from 'lodash/find';
	import get from 'lodash/get';
	import clamp from 'lodash/clamp';
	import isEmpty from 'lodash/isEmpty';
	import debounce from 'lodash/debounce';
	import { prepared, channel, exchangeable, userCurrencies, bankAccounts } from '$lib/stores/user';
	import { BankAccountsApi } from '$lib/apis';
	import { notify, trigger } from '$lib/functions/util';
	import Card from '$lib/components/Card';
	import Metatags from '$lib/components/Metatags';
	import Checkbox from '$lib/components/Checkbox';
	import Radio from '$lib/components/Radio';
	import Button from '$lib/components/Button';
	import Modal from '$lib/components/Modal';
	import ActivateModalSet, { checkActivated } from '$lib/components/ActivateModalSet';

	const returnPath = '/my/diamond';
	const exchangeLimit = 450000;

	let diamondAmount = 0; //所持ダイヤ
	let useDiamond = 0; //消費ダイヤ
	let incomeTax = 0; //源泉所得税
	let commission = 0; //決済手数料
	let transferAmount = 0; //振込金額
	let consumptionTax = 0; //消費税
	let checked = false;
	let completeModal = false;
	let selectedBankIndex = 0;
	let loading = false;
	let initialized = false;
	let activateModal = false;

	const onCompleted = debounce(() => goto(returnPath), 500, {
		leading: false,
		trailing: true
	});

	function onClickedBankInfo(index) {
		selectedBankIndex = index;
	}

	function checkAvailabilities() {
		BankAccountsApi.getApiV1BankAccountsMeWithdrawalStatus()
			.then(data => {
				switch(data?.status ?? '') {
					case 'Ready':
					case 'Processing':
						throw new Error('Unavailable');
				}
			})
			.catch(_ => {
				notify('現在振込手続きを行うことはできません');
				goto(returnPath);
			});
	}

	async function onClickedApplicationButton() {
		if( await checkActivated() ){
			activateModal = true;
			return;
		}
		loading = true;
		const selectBank = $bankAccounts[selectedBankIndex];
		BankAccountsApi.postApiV1BankAccountsWithdraw({
			bankAccountUuid: selectBank?.uuid ?? '',
			useDiamond
		})
			.then(_ => {
				completeModal = true;
			})
			.catch(console.error)
			.finally(() => loading = false);
	}

	function toJPY(price) {
		return Number(price).toLocaleString('ja-JP', {
			style: 'currency',
			currency: 'JPY',
		});
	}

	function calculate() {
		const userDiamond = find($userCurrencies, {currencyType: 'Diamond'});
		diamondAmount = clamp(get(userDiamond, 'amount', 0), 0, exchangeLimit);
		return BankAccountsApi.getApiV1BankAccountsCalculateTransferAmount({
			useDiamond: diamondAmount
		})
			.then(data => {
				useDiamond = data?.useDiamond ?? 0;
				incomeTax = data?.incomeTax ?? 0;
				commission = data?.commission ?? 0;
				transferAmount = data?.transferAmount ?? 0;
				consumptionTax = data?.consumptionTax ?? 0;
				initialized = true;
			})
			.catch(console.error);
	}

	onMount(async () => {
		// NOTE: ページ再読み込みされた場合を考慮して口座情報取得を再試行
		await bankAccounts.fetch();
		if (!$bankAccounts.length) {
			goto(returnPath);
		}
	});

	$: if ($prepared) {
		checkAvailabilities();
		if(!isEmpty($userCurrencies)) {
			calculate();
		}
	}

	// NOTE: 複数タブで同画面を開いている時に、処理をしていないタブでは処理完了後強制遷移させる
	$: if (initialized && !$exchangeable) {
		notify('ダイヤ所持数が更新されました');
		goto(returnPath);
	}

</script>

<!-- NOTE: 複数タブで開いている時に、非アクティブタブはタイマー精度が落ちてしまうため、暫定的にアクティブ化したタイミングでダイヤ情報を再取得している -->
<!-- FIXME: 精度が落ちないsetInterval alternative を WebWorker で実装する -->
<!-- REF: https://fingger.atlassian.net/browse/PFBT-554 -->
<svelte:window on:focus={ () => trigger('user-update') } />

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{$channel.title} / ダイヤ / 換金申請"
	description="{$channel.title} / ダイヤ / 換金申請"
/>

<div class="flex flex-col items-center px-6 pb-12 mt-4">
	<Card class="fi-border mt-4 w-full max-w-460px bg-white dark:bg-gray-900 border-1 shadow-02dp text-left">
		<div class="py-8 px-8 md:px-16">
			<div class="mx-auto table table-fixed w-full">
				<div class="history-table table-row">
					<div class="table-cell text-left">報酬申請額</div>
					<div class="table-cell text-right">{toJPY(useDiamond)}</div>
				</div>
				<div class="history-table table-row">
					<div class="table-cell text-left">消費税</div>
					<div class="table-cell text-right">{toJPY(consumptionTax)}</div>
				</div>
				<div class="history-table table-row">
					<div class="table-cell text-left">源泉所得税</div>
					<div class="table-cell text-right">{toJPY(incomeTax)}</div>
				</div>
				<div class="history-table table-row">
					<div class="table-cell text-left pb-2">決済手数料</div>
					<div class="table-cell text-right">{toJPY(commission)}</div>
				</div>
				<div class="history-table table-row text-2xl">
					<div class="table-cell text-left pt-2 border-t-1">振込額</div>
					<div class="table-cell text-right border-t-1">{toJPY(transferAmount)}</div>
				</div>
			</div>
		</div>
	</Card>

	<div class="mt-6 min-w-full md:min-w-530px">
		<div class="flex items-center mb-2">
			<h4 class="text-sm md:text-lg font-bold pr-4 fi-text-sub">口座情報</h4>
			<p class="text-xs md:text-sm flex-grow">５つまで登録できます</p>
		</div>
		<ul class="m-auto">
			{#each $bankAccounts as item, index}
				<li class="flex items-center fi-border w-full mb-1 py-4 pl-4 pr-3 rounded-lg bg-white dark:bg-gray-900 border-1 shadow-02dp">
					<Radio bind:group={selectedBankIndex} value={index}/>
					<div on:click={()=>onClickedBankInfo(index)} class="flex-grow text-sm pl-2 pr-1">
						{item.bankName}<br/>
						{item.branchCode}<br/>
						{item.accountNumber}<br/>
						{item.accountName}
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<div class="flex flex-col pt-8 max-w-712px text-xs md:text-sm">
		<h4 class="mb-2 md:font-bold">finggerダイヤによる報酬支払手続きにあたってのご注意事項</h4>
		<p class="fi-lb-strict">
			なお、本注意事項は「fingger利用規約」第1条第4項のfingger個別規約に該当します。<br/>
			報酬アイテムであるfinggerダイヤ（以下「ダイヤ」といいます）は、1個あたり1円にあたります。<br/>
			報酬支払基準・条件の詳細については、必ず「fingge配信規約」をご確認ください。<br/>
			配信者は、当社が指定するペイメントサービス（以下「ペイメントサービス」といいます）により、銀行振り込みの方式で、支払いを受けることができます。<br/>
			報酬を受け取るためには、配信者はペイメントサービスの手続きを必ず完了する必要があります。なお、ペイメントサービスの決済手数料は、配信者が負担するものとします。<br/>
			ダイヤの換金（報酬基準）<br/>
			報酬の支払い金額は、報酬支払申請の対象となるダイヤ数、当社が別途定める基準に基づき算出した金額から、源泉所得税（10.21%）と決済手数料を差し引いた金額となります。<br/>
			ただし配信者がfinggerと法人契約を結んでいる場合は源泉所得税は差し引かれません。<br/>
			決済手数料は、以下の通りとなります。<br/>
			・ダイヤ数30,000以上の報酬支払申請1件につき350円<br/>
			・ダイヤ数30,000未満の報酬支払申請1件につき300円<br/>
			ただし配信者がfinggerと法人契約を結んでいる場合は決済手数料は無料となります。
		</p>
	</div>

	<div class="flex items-center justify-center mt-6">
		<Checkbox bind:checked={checked}>
			<span class="ml-6">注意事項に同意する</span>
		</Checkbox>
	</div>

	<div class='flex gap-8 mt-6'>
		<Button text to={returnPath}>キャンセル</Button>
		<Button disabled={!checked || loading || !$bankAccounts.length} {loading} on:click={onClickedApplicationButton}>
			振込申請
		</Button>
	</div>
</div>

<Modal bind:active={completeModal} acceptable closeable={false}
	on:close={onCompleted}
	class="w-90 rounded-lg">
	<p class="p-6 text-sm">
		振込の申請が完了しました。
	</p>
</Modal>

<!-- 配信アクティベート -->
<ActivateModalSet bind:active={activateModal} />
