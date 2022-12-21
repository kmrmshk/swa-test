<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import debounce from 'lodash/debounce';
	import Modal from '$lib/components/Modal';
	import Button from '$lib/components/Button';
	import Datalist from '$lib/components/Datalist';
	import Select from '$lib/components/Select';
	import TextField from '$lib/components/TextField';
	import { BankAccountsApi } from '$lib/apis';
	import {
		requestBankDetail,
		requestBranchDetail,
		requestBanksByName,
		requestBranchesByName
	} from '$lib/functions/bankcode';
	import { strLength } from '$lib/functions/util';
	import Checkbox from '$lib/components/Checkbox';

	export let active = false;

	const dispatch = createEventDispatcher();
	const categories = [
		null,
		{ name: '普通', value: 1 },
		{ name: '当座', value: 2 },
	];
	const accountNumberMaxlength = 7;
	const accountNameMaxlength = 48;
	const bankNameMaxlength = 60;
	const branchNameMaxlength = 60;

	let banks = [];
	let branches = [];

	let uuid = '';
	let bankCode = '';
	let bankName = '';
	let branchCode = '';
	let branchName = '';
	let accountType = '';
	let accountNumber = '';
	let accountName = '';
	let isAutoTransfer = false;

	let bankCodeError = '';
	let bankNameError = '';
	let branchCodeError = '';
	let branchNameError = '';
	let accountTypeError = '';
	let accountNumberError = '';
	let accountNameError = '';

	let confirmModal = false;
	let processing = false;

	$: isRegistration = !uuid;
	$: isValid = !!(
		!bankCodeError.length && bankCode.length &&
		!branchCodeError.length && branchCode.length &&
		!accountTypeError.length && accountType.length &&
		!accountNumberError.length && accountNumber.length &&
		!accountNameError.length && accountName.length
	);

	export function reset() {
		uuid = '';
		bankCode = '';
		bankName = '';
		branchCode = '';
		branchName = '';
		accountType = '';
		accountNumber = '';
		accountName = '';
		isAutoTransfer = false;
		bankCodeError = '';
		branchCodeError = '';
		accountTypeError = '';
		accountNumberError = '';
		accountNameError = '';
		banks = [];
		branches = [];
	}

	export function setData(data) {
		uuid = data.uuid || '';
		bankCode = data.bankCode;
		branchCode = data.branchCode
		accountType = data.accountType;
		accountNumber = data.accountNumber;
		accountName = data.accountName;
		isAutoTransfer = data.isAutoTransfer;
	}

	const validateBankCodeDebounce = debounce(validateBankCode, 500, {leading: false, trailing: true});
	async function validateBankCode() {
		let searchResult = '';
		if(bankCode?.length === 4) {
			searchResult = await requestBankDetail(bankCode).then(({data}) => {
				//bankName = data?.name ?? '';
				// return bankName;
				return data?.name ?? '';
			});
		}
		if(!bankCode || bankCode.length !== 4 || !searchResult) {
			bankCodeError = (bankCode.length === 0) ? ' ' : '銀行コードに誤りがあります。';
			branchCode = '';
			branchCodeError = '';
		} else {
			bankCodeError = '';
		}
		return !!bankCodeError;
	}

	const validateBranchCodeDebounce = debounce(validateBranchCode, 500, {leading: false, trailing: true});
	async function validateBranchCode() {
		let searchResult = false; // '';
		if(bankCode.length === 4 && branchCode.length === 3) {
			searchResult = await requestBranchDetail(bankCode, branchCode).then(({data}) => {
				// branchName = (data.length === 1) ? data[0].name : '';
				// return branchName;
				return !!data?.length;
			});
		}
		if(!branchCode || branchCode.length !== 3 || !searchResult) {
			branchCodeError = (branchCode.length === 0) ? ' ' : '支店コードに誤りがあります。';
		} else {
			branchCodeError = '';
		}
		return !!branchCodeError;
	}

	function validateCategory() {
		accountTypeError = accountType ? '' : '   選択してください。';
		return !!accountTypeError;
	}

	function validateNumber() {
		// NOTE: 入力文字数が0のときはエラー文言は表示させないため、エラー文言としてスペースを代わりに挿入
		if(accountNumber.length === 0) {
			accountNumberError = ' ';
		} else if( strLength(accountNumber) > accountNumberMaxlength) {
			accountNumberError = '文字数オーバーです。';
		} else {
			accountNumberError = accountNumber.match(/^[0-9]+$/) ? '' : '不正な値が入力されています。';
		}
		return !!accountNumberError;
	}

	function validateName() {
		const validTypes = /^[a-zA-Z0-9ｦ-ﾟ()\.\-ａ-ｚＡ-Ｚ０-９ァ-ヴ（）．－ー\s]+$/;
		// NOTE: 入力文字数が0のときはエラー文言は表示させないため、エラー文言としてスペースを代わりに挿入
		if(accountName.length === 0) {
			accountNameError = ' ';
		} else if( strLength(accountName) > accountNameMaxlength) {
			accountNameError = '文字数オーバーです。';
		} else {
			// NOTE: 本来許容する文字は全角英数字・カタカナ（大文字）・一部の記号のみ
			// NOTE: サーバーサイドで半角変換が入る都合上、半角もバリデーションを通す
			accountNameError = accountName.match(validTypes) ? '' : '不正な値が入力されています。';
		}
		return !!accountNameError;
	}

	const onUpdateBankName = debounce(_onUpdateBankName, 250, {leading: false, trailing: true});
	function _onUpdateBankName({detail = ''}) {
		branchCode = '';
		branches = [];
		branchCodeError = '';
		bankNameError = '';
		if(!detail.length) {
			banks = [];
			return;
		} else if( strLength(detail) > bankNameMaxlength ){
			banks = [];
			bankNameError = '文字数オーバーです。';
			return;
		}
		requestBanksByName(detail).then(res => {
			banks = res.data.data.map(({ name, code }) => ({ name, value: code }))
		});
	}

	function onSelectedBankCode({ detail }) {
		bankCode = detail?.value;
		bankCodeError = '';
		branchCode = '';
		branches = [];
		branchCodeError = '';
		branchName = '';
	}

	const onUpdateBranchName = debounce(_onUpdateBranchName, 250, {leading: false, trailing: true});
	function _onUpdateBranchName({detail = ''}) {
		branchNameError = '';
		if(!detail) {
			branches = [];
			return;
		} else if( strLength(detail) > branchNameMaxlength ){
			branches = [];
			branchNameError = '文字数オーバーです。';
			return;
		}
		requestBranchesByName(bankCode, detail).then(res => {
			branches = res.data.data.map(({ name, code }) => ({ name, value: code }));
		});
	}

	function onSelectedBranchCode({ detail }) {
		branchCode = detail?.value;
		branchCodeError = '';
	}

	function onClickRegistrationButton() {
		processing = true;
		let promise;
		if(isRegistration) {
			promise = BankAccountsApi.postApiV1BankAccountsCreate({
				bankCode,
				branchCode,
				accountType,
				accountNumber,
				accountName,
				isAutoTransfer
			});
		} else {
			promise = BankAccountsApi.patchApiV1BankAccounts({
				bankAccountUuid: uuid,
				bankCode,
				branchCode,
				accountType,
				accountNumber,
				accountName,
				isAutoTransfer
			});
		}
		promise.then(data => {
			dispatch(data === true ? 'success' : 'failure', data);
			active = false;
		}).catch(e => {
			dispatch('error', e);
		}).finally(() => {
			processing = false;
		});
	}

	function onClickedAbortProcess() {
		active =
		confirmModal = false;
	}
</script>

<Modal bind:active={ active } closeable={ false } fill persistent class="w-160 h-full max-h-full md:max-h-160">
	<div class="absolute inset-0 flex flex-col w-full h-full overflow-hidden">
		<h4 class="relative justify-center flex-shrink-0 w-full pt-4 pb-3 text-sm text-center md:(pt-8 pb-5 text-2xl) border-b-1 border-base-dark border-opacity-10">
			<slot name="header">口座情報入力</slot>
		</h4>
		<div class="relative px-4 md:px-14 md:py-9 flex-1 inset-x-0 max-w-full overflow-y-auto overflow-x-hidden">
			<ul class="w-full">
				<li class="mt-6 md:mt-0 md:pr-8 flex flex-col md:flex-row items-start md:items-center">
					<span class="block w-full md:w-1/4 pr-6 text-left md:text-right text-xs md:text-sm md:font-bold text-base-dark text-opacity-60 dark:(text-white text-opacity-60)">銀行コード</span>
					<div class="relative flex items-center w-full md:w-3/4">
						<TextField
							bind:value={ bankCode }
							class="w-2/5 h-12.5"
							placeholder="銀行コード"
							error={ !!bankCodeError }
							maxlength={4}
							on:input={ validateBankCodeDebounce }
							on:blur={ validateBankCode }
						/>
						<Datalist
							bind:value={ bankName }
							class="ml-2 w-3/5"
							placeholder="銀行名から検索"
							options={ banks }
							filtering={ false }
							error={ bankNameError }
							maxlength={ bankNameMaxlength +1 }
							on:input={ onUpdateBankName }
							on:select={ onSelectedBankCode }
						/>
						{#if bankCodeError }
							<span class="absolute top-1/1 left-4 text-error-light dark:text-rose-300 text-xs">{ bankCodeError }</span>
						{/if}
					</div>
				</li>
				<li class="mt-6 md:mt-7 md:pr-8 flex flex-col md:flex-row items-start md:items-center">
					<span class="block w-full md:w-1/4 pr-6 text-left md:text-right text-xs md:text-sm md:font-bold text-base-dark text-opacity-60 dark:(text-white text-opacity-60)">支店コード</span>
					<div class="relative flex items-center w-full md:w-3/4">
						<TextField
							bind:value={ branchCode }
							class="w-2/5 h-12.5"
							placeholder="支店コード"
							disabled={ !bankCode || bankCodeError }
							error={ !!branchCodeError }
							maxlength={3}
							on:input={ validateBranchCodeDebounce }
							on:blur={ validateBranchCode }
						/>
						<Datalist
							bind:value={ branchName }
							class="ml-2 w-3/5"
							placeholder="支店名から検索"
							disabled={ !bankCode || bankCodeError }
							options={ branches }
							filtering={ false }
							error={ branchNameError }
							maxlength={ branchNameMaxlength +1 }
							on:input={ onUpdateBranchName }
							on:select={ onSelectedBranchCode }
						/>
						{#if branchCodeError}
							<span class="absolute top-1/1 left-4 text-error-light dark:text-rose-300 text-xs">{ branchCodeError }</span>
						{/if}
					</div>
				</li>
				<li class="mt-6 md:mt-7 md:pr-8 flex flex-col md:flex-row items-start md:items-center">
					<span class="block w-full md:w-1/4 pr-6 text-left md:text-right text-xs md:text-sm md:font-bold text-base-dark text-opacity-60 dark:(text-white text-opacity-60)">預金種目</span>
					<div class="flex items-center w-full md:md:w-3/4">
						<Select
							bind:value={ accountType }
							class="w-2/5 md:h-12"
							list={ categories }
							error={ accountTypeError }
							placeholder="預金種目"
							on:blur={ validateCategory }
						/>
					</div>
				</li>
				<li class="mt-6 md:mt-7 md:pr-8 flex flex-col md:flex-row items-start md:items-center">
					<span class="block w-full md:w-1/4 pr-6 text-left md:text-right text-xs md:text-sm md:font-bold text-base-dark text-opacity-60 dark:(text-white text-opacity-60)">口座番号</span>
					<TextField
						bind:value={ accountNumber }
						class="w-1/1 md:w-3/4 h-13"
						placeholder="口座番号（半角数値）"
						error={ !!accountNumberError }
						errorText={ accountNumberError }
						maxlength={ accountNumberMaxlength +1 }
						on:input={ validateNumber }
						on:blur={ validateNumber }
					/>
				</li>
				<li class="mt-6 mb-4 md:mt-7 md:mb-0 md:pr-8 flex flex-col md:flex-row items-start md:items-center">
					<span class="block w-full md:w-1/4 pr-6 text-left md:text-right text-xs md:text-sm md:font-bold text-base-dark text-opacity-60 dark:(text-white text-opacity-60)">口座名義人名</span>
					<TextField
						bind:value={ accountName }
						class="w-1/1 md:w-3/4 h-13"
						placeholder="口座名義人名（カナ英数）"
						error={ !!accountNameError }
						errorText={ accountNameError }
						maxlength={ accountNameMaxlength +1 }
						on:input={ validateName }
						on:blur={ validateName }
					/>
				</li>
			</ul>
		</div>
		<div class="flex flex-wrap justify-center items-center py-4 md:pt-8 md:pb-9 bottom-0 md:min-h-27 w-full border-t-1 border-base-dark border-opacity-10">
			<div class="mb-8 flex-grow w-full text-center">
				<Checkbox bind:checked={isAutoTransfer}>
					<span class="ml-4">自動振込口座に設定する</span>
				</Checkbox>
			</div>
			<Button text disabled={ false } on:click={ () => confirmModal = true }>キャンセル</Button>
			<Button class="ml-11" disabled={ !isValid } on:click={ onClickRegistrationButton } loading={ processing }>
				{#if isRegistration}
					登録
				{:else}
					更新
				{/if}
			</Button>
		</div>
	</div>
</Modal>

<Modal
	class="w-70 rounded-lg"
	bind:active={ confirmModal }
	closeable={ false }
	cancelable
	acceptable
	on:cancel={ () => confirmModal = false }
	on:accept={ onClickedAbortProcess }
>
	<p class="p-6 text-sm">入力途中のデータは保存されませんが終了してよろしいですか？</p>
	<span slot="cancel" class="text-base">キャンセル</span>
	<span slot="accept" class="text-base">OK</span>
</Modal>

<style>
	:global(.wrapper .message) {
		text-align: left !important;
		margin-left: 1em;
	}
</style>
