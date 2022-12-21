<script context="module" lang="ts">
	export const eventPurchaseStatus = 'purchase-status';
</script>
<script lang="ts">
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { dark } from '$lib/stores/theme';
	import formatISO from 'date-fns/formatISO/index.js';
	import get from 'lodash/get';
	import map from 'lodash/map';
	import find from 'lodash/find';
	import range from 'lodash/range';
	import {
		coin,
		ageNotSettled,
		ageRange,
		parentalConsent,
		prepared,
	} from '$lib/stores/user';
	import { transactionId, price } from '$lib/stores/purchase';
	import { trigger } from '$lib/functions/util';

	import Radio from '$lib/components/Radio';
	import Button from '$lib/components/Button';
	import Modal from '$lib/components/Modal';
	import Checkbox from '$lib/components/Checkbox';
	import Select from '$lib/components/Select';

	import { PaymentsApi } from '$lib/apis';
	import { UsersApi } from '$lib/apis';

	export let active = false;

	const lastYear = new Date().getFullYear() - 1;
	const yearList = [null, ...range(1920, lastYear).map(y => ({ name: y, value: y })).reverse()];
	const monthList = [null, ...range(1, 13).map(m => ({ name: m, value: m }))];
	const daysList = [null, ...range(1, 32).map(d => ({ name: d, value: d }))];
	let redirectUrl = '';

	let paymentProducts = [];
	let checked = false;
	let selectedProductId = '';
	let selectedYear = null;
	let selectedMonth = null;
	let selectedDay = null;

	let processingVerification = false;
	let resultSuccess = true;
	let resultPurchasePrice = '';

	let verificationModal = false;
	let purchaseCoinModal = false;
	let parentalConsentModal = false;
	let resultModal = false;

	function closeAllModals() {
		verificationModal =
		purchaseCoinModal =
		parentalConsentModal =
		resultModal = false;
	}

	function onCatchedStatus(e) {
		const { status, price } = e.detail;

		resultSuccess = (status === 'success');
		resultPurchasePrice = Number(price).toLocaleString('ja-JP', {
			style: 'currency',
			currency: 'JPY'
		});
		resultModal = true;
	}

	function onClickedPurchaseButton() {
		if(!browser) return;
		const popupWidth = 1000;
		const popupHeight = 700;
		// NOTE: Safariはasync/await内でwindow.openが効かなくなる
		const windowParams = map({
			screenX: window.screenX + (window.outerWidth / 2) - (popupWidth / 2),
			screenY: window.screenY + (window.outerHeight / 4),
			width: popupWidth,
			height: popupHeight
		}, (v, k) => `${ k }=${ v }`).join(',');
		const checkoutWindow = window.open('/checkout', 'checkout-window', windowParams);

		resultSuccess = false;

		PaymentsApi
			.postApiV1Payments({
				paymentProductUuid: `${selectedProductId}`,
				redirectBaseUrl: redirectUrl
			})
			.then(data => {
				$transactionId = data.transactionId;
				$price = selectedPrice;
				checkoutWindow.location = `/checkout/${ data.transactionId }`;
				closeAllModals();
				active = false;
			})
			.catch(rejected => {
				checkoutWindow.close();
				console.error(rejected);
			});
	}

	async function onClickedVerificationAge() {
		processingVerification = true;
		const birthdate = formatISO(new Date(selectedYear, selectedMonth - 1, selectedDay));
		const result = await UsersApi
			.putApiV1UsersMeBirthdate({ requestBody: { birthdate } });
		if(result) {
			const range = result.ageRange;
			ageRange.set(range);
			if(range < 3) {
				parentalConsent.set(0);
				parentalConsentModal = true;
			} else {
				purchaseCoinModal = true;
			}
			verificationModal = false;
		}
	}

	function selectModal() {
		if ($ageNotSettled) {
			processingVerification = false;
			verificationModal = true;
		} else if($ageRange < 3 && !$parentalConsent) {
			parentalConsentModal = true;
		}
		else {
			purchaseCoinModal = true;
		}
	}

	function fetchCurrencies() {
		PaymentsApi
			.getApiV1PaymentsProductsCurrencies()
			.then(data => {
				paymentProducts = map(data, item => ({
					name: item.name,
					uuid: item.uuid,
					price: item.price,
				}));
			})
			.catch(console.error);
	}

	$: inputAge = selectedYear && selectedMonth && selectedDay;
	$: purchasable = checked && selectedProductId.length;
	$: selectedPrice = get(find(paymentProducts, { uuid: selectedProductId }), 'price', '');

	$: if (active) {
		selectModal();
	}
	else {
		closeAllModals();
		checked = false;
		selectedProductId = '';
	}

	$: if ($prepared) {
		fetchCurrencies();
	}

	beforeNavigate(() => {
		active = false;
	});

	function onMessage({ data }) {
		if(data.type !== eventPurchaseStatus) {
			return;
		}
		if ($transactionId === data.transactionId) {
			trigger(eventPurchaseStatus, {
				status: data.status,
				transactionId: $transactionId,
				price: $price,
			});
			trigger('user-update');
		}
	}

	onMount(() => {
		redirectUrl = `${location.protocol}//${location.host}/checkout`;
		browser && window?.addEventListener('message', onMessage);
	});

	onDestroy(() => {
		browser && window?.removeEventListener('message', onMessage);
	});
</script>

<svelte:window
	on:purchase-status={onCatchedStatus}
	on:purchase-openmodal={() => active = true}
/>

<Modal bind:active={verificationModal} on:close={ () => active = false } fill class="md:(w-720px max-h-full)">
	<div class="pb-9">
		<h2 class="text-center mt-5 md:mt-7 md:text-2xl">
			年齢確認
		</h2>
		<h4 class="flex items-center justify-center mt-22 md:(justify-start pl-0 justify-center mt-31)">
			生年月日を設定してください
		</h4>

		<div class="mt-7 flex justify-center">
			<Select disabled={processingVerification} bind:value={selectedYear} list={ yearList } placeholder="年"></Select>
			<Select disabled={processingVerification} bind:value={selectedMonth} list={ monthList } placeholder="月" class="ml-6"></Select>
			<Select disabled={processingVerification} bind:value={selectedDay} list={ daysList } placeholder="日" class="ml-6"></Select>
		</div>
		<p class="mt-6 md:mt-7 text-sm text-center text-error-dark dark:text-error-light">
			一度設定すると変更できませんので、
			<br class="md:hidden">ご注意ください。
		</p>
		<div
			class="mt-7 md:mt-25 py-5 md:py-6 w-full bg-base-light dark:bg-white dark:bg-opacity-12 text-base-dark text-opacity-87">
			<h5 class="text-sm text-center text-base-dark text-opacity-87">年齢ごとの購入月限度額</h5>
			<dl class="mt-5 flex text-sm md:text-base dark:text-white dark:text-opacity-87 flex-wrap w-full">
				<dt class="w-1/2 text-right pr-14px">15歳未満</dt>
				<dd class="w-1/2 text-left pl-14px">月額1万円まで</dd>
				<dt class="w-1/2 text-right pr-14px">15歳以上18歳未満</dt>
				<dd class="w-1/2 text-left pl-14px">月額3万円まで</dd>
				<dt class="w-1/2 text-right pr-14px">18歳以上</dt>
				<dd class="w-1/2 text-left pl-14px">無制限</dd>
			</dl>
		</div>
		<div class="mt-5 md:mt-18 text-center">
			<Button
				class="text-base-dark min-w-14"
				disabled={!inputAge || processingVerification}
				loading={processingVerification}
				on:click={ onClickedVerificationAge }
			>
				OK
			</Button>
		</div>
	</div>
</Modal>

<!-- 入力生年月から18歳未満の場合の保護者同意確認モーダル-->
<Modal
	class="w-120 max-h-120 max-h-full md:max-h-180"
	bind:active={ parentalConsentModal }
	on:accept={ () => {
		parentalConsent.set(1);
		purchaseCoinModal = true;
	}}
	on:cancel={ () => active = false }
	closeable={false}
	persistent
	acceptable
	cancelable
>
	<div class="fi-lb p-6 pb-1 md:p-8 md:pb-4 w-full text-center">
		<h3 class="text-center font-bold text-xl">保護者の方の同意</h3>
		<p class="pt-6 pb-3 text-sm">finggerコインを買うには保護者の方の同意が必要になります。</p>
		<h4 class="text-center font-bold text-base">同意はもらっていますか？</h4>
	</div>
	<span slot="cancel">いいえ</span>
	<span slot="accept">はい</span>
</Modal>

<Modal bind:active={purchaseCoinModal} on:close={ () => active = false } fill class="md:(w-720px max-h-full)">
	<div class="md:px-30 pb-9" class:dark={ $dark }>
		<div class="hidden md:block">
			<h2 class="text-center mt-7 text-2xl">
				finggerコイン購入
			</h2>
			<h4 class="flex items-center h-13 pl-0 justify-center mt-5 border-1 border-base-dark border-opacity-10 rounded-lg">
				<span class="fi-text-sub">所持コイン</span>
				<img class="ml-10" src="/assets/images/icons/coin.svg" width="24" height="24" alt="coin"/>
				<span class="mx-3">{ $coin }</span>
			</h4>
		</div>
		<div class="md:hidden flex items-center justify-start pl-4 h-14">
			<h4 class="font-bold flex-grow text-left">finggerコイン購入</h4>
			<img class="ml-7" src="/assets/images/icons/coin.svg" width="24" height="24" alt="coin"/>
			<p class="flex flex-col pl-4 pr-14 flex-wrap flex-grow">
				<span class="fi-text-sub text-xs">所持コイン</span>
				<span>{ $coin }</span>
			</p>
		</div>

		<ul class="fi-border table table-fixed w-full border-1 md:(mt-3 rounded-lg overflow-hidden)">
			<li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-1 border-base-dark border-opacity-10 text-sm">
				<div class="fi-border table-cell border-b-1"></div>
				<div class="fi-border table-cell border-b-1"></div>
				<div class="fi-border table-cell border-b-1">コイン</div>
				<div class="fi-border table-cell border-b-1">支払い金額</div>
			</li>

			<!-- コイン購入額一覧 -->
			{#if !paymentProducts.length}
				<li class="table-row px-8 h-13 text-md">
					<td colspan="4" class="align-middle text-center text-sm">
						購入可能なコインがありません
					</td>
				</li>
			{/if}

			{#each paymentProducts as item, index}
				<li class="table-row px-8 h-13 text-md"
					class:dark={ $dark }
					class:selected={ selectedProductId == item.uuid }
					on:click={ () => selectedProductId = item.uuid }>
					<div class="fi-border table-cell" class:border-b-1={ index < paymentProducts.length - 1 }>
						<Radio bind:group={selectedProductId} value={item.uuid} class="align-middle"/>
					</div>
					<div class="fi-border table-cell" class:border-b-1={ index < paymentProducts.length - 1 }>
						<img class="inline" src="/assets/images/icons/coin.svg" width="24" height="24" alt="coin"/>
					</div>
					<div class="fi-border table-cell" class:border-b-1={ index < paymentProducts.length - 1 }>
						{item.name}
					</div>
					<div class="fi-border table-cell" class:border-b-1={ index < paymentProducts.length - 1 }>
						{item.price.toLocaleString()}円
					</div>
				</li>
			{/each}
		</ul>

		<p class="mt-4 px-8 text-xs md:(px-0 text-center)">
			※表示価格は、消費税込みの金額となっております。
			<br>
			<a href="{ import.meta.env.url_settlement_policy }" class="text-teal-600" target="_blank">資金決済法に基づく表示</a>・<a href="{ import.meta.env.url_privacy_policy }" class="text-teal-600" target="_blank">プライバシーポリシー</a>をご確認の上、お手続きください。
		</p>
		<div class="mt-3 md:mt-6 flex justify-center items-center">
			<Checkbox bind:checked={checked}>
				<span class="ml-4 text-md">確認しました</span>
			</Checkbox>
		</div>
		<div class="mt-5 md:mt-8 text-center">
			<Button disabled={!purchasable} on:click={ onClickedPurchaseButton } class="text-base-dark">
				お支払い手続きを続ける
			</Button>
		</div>
	</div>
</Modal>

<Modal bind:active={resultModal} on:accept={ () => active = false } acceptable closeable={false} class="w-70 rounded-lg">
    <div class="pt-6 px-6 pb-2">
        {#if resultSuccess}
            <p class="text-sm">決済が完了しました</p>
            <h4 class="mt-5 text-2xl">{ resultPurchasePrice }</h4>
        {:else}
	        <p class="text-sm">お支払い手続きがキャンセルされました</p>
        {/if}
    </div>
</Modal>

<style lang="scss">

	.table-row.selected {
		@apply bg-teal-600 bg-opacity-8 dark:bg-white bg-opacity-12;
	}

	.dark .table-row.selected {
		@apply bg-white bg-opacity-4;
	}

	.table-cell:first-child {
		@apply pl-8 text-center;
		width: 10%;
	}

	.table-cell:nth-child(2) {
		@apply text-right;
		width: 15%;
	}

	.table-cell:nth-child(3) {
		width: 35%;
	}

	.table-cell:last-child {
		@apply pr-8;
		width: 40%;
	}

	.table-cell {
		@apply align-middle text-right;
	}
</style>
