<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import get from 'lodash/get';
	import format from 'date-fns/format/index.js';
	import { dark } from '$lib/stores/theme';
	import { channel } from '$lib/stores/user';
	import Modal from '$lib/components/Modal';
	import Button from '$lib/components/Button';
	import Radio from '$lib/components/Radio';
	import Loading from '$lib/components/Loading';
	import TextField from '$lib/components/TextField';
	import { CampaignApi, DistributionsApi } from '$lib/apis';
	import { strLength } from '$lib/functions/util';
	import SettingUnlistedArea from './SettingUnlistedArea.svelte';
	import SettingGiftArea from './SettingGiftArea.svelte';
	import SettingTagArea from './SettingTagArea.svelte';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionYouTubePublic as DistributionYoutube,
		FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionMePublic as DistributionMe,
		FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic as Tag
	} from '$lib/apis';
	const dispatch = createEventDispatcher();

	const youtubeStudio = 'https://studio.youtube.com/channel/';
	const maxlength = 32;
	const maxTagLength = 15;

	export let active = false;
	export let upComings:Array<DistributionMe|DistributionYoutube> = [];
	export let promise = Promise<void>;
	export let asPrivate = false;
	export let isGiftEnable = false;
	export let isGiftEffectEnable = false;
	export let gameGiftEnable = false;
	export let alreadyLinking = false;
	export let campaignCode = '';
	export let bundleId = '';
	export let selectedTags:Array<Tag> = [];
	export let allTags:Array<Tag> = [];

	let selectedIndex = -1;
	let selectedDistribution = false;
	let selectedOtherSetting = false;
	let targetDistribution:DistributionMe|DistributionYoutube;
	let input:HTMLElement;
	let masked = true;
	let campaignCodeError = '';
	let campaignCodeName = '';

	function onClickedGotoStudio() {
		active = false;
		window.open(`${ youtubeStudio }/${ $channel['id'] }/livestreaming/manage`, '_blank');
	}

	function onKeypressInput(e) {
		if (campaignCode.length && e.charCode === 13) {
			e.preventDefault();
			checkCampaignCode();
		}
	}

	function onKeyupInput(e) {
		if(e.keyCode !== 13){
			if( strLength(campaignCode) > maxlength ){
				campaignCodeError = '文字数オーバーです';
			}
			else{
				campaignCodeError = '';
			}
		}
	}

	async function checkCampaignCode() {
		if( campaignCodeError.length ){
			return false;
		}
		if( campaignCode === ''){
			campaignCodeError = '';
			campaignCodeName = '';
			return true;
		}
		//キャンペーンコード判定
		return CampaignApi
			.getApiV1Campaign({ campaignCode })
			.then(data => {
				if (!data) {
					campaignCodeError = '該当のコードは存在しません';
					campaignCodeName = '';
					return false;
				}
				campaignCodeError = '';
				campaignCodeName = data.name ?? '';
				return true;
			});
	}

	async function gotoTagSetting() {
		//キャンペーンコード判定
		if ( await checkCampaignCode() ){
			masked = true;
			campaignCodeError = '';
			campaignCodeName =''
			selectedOtherSetting = true;
		}
	}

	async function onClickedAccept() {
		active = false;
		selectedDistribution = false;
		selectedOtherSetting = false;
		dispatch('accepted');
	}

	function deselectDistribution() {
		selectedDistribution = false;
	}

	function gotoOtherSetting() {
		selectedOtherSetting = false;
	}

	function reset(){
		active = false;
		isGiftEnable = gameGiftEnable;
		isGiftEffectEnable = gameGiftEnable;
		masked = true;
		campaignCode= '';
		campaignCodeError = '';
		campaignCodeName = '';
		selectedDistribution = false;
		selectedOtherSetting = false;
	}

	async function onSelectedDistribution() {
		selectedDistribution = true;
		targetDistribution = get(upComings, `${ selectedIndex }`);
		asPrivate = !! (targetDistribution?.privacyStatus ?? '').match(/^((unlisted)|(private))$/i);
		if(alreadyLinking && targetDistribution.uuid){
			selectedTags = await DistributionsApi.getApiV1DistributionsTags({uuid: targetDistribution.uuid});
		}
		dispatch('select', selectedIndex);
	}

	$: if(active && upComings.length === 1) {
		selectedIndex = 0;
		onSelectedDistribution();
	}
</script>

<Modal bind:active={ active } on:close={ reset } fill class="w-180 md:min-h-120 h-full max-h-full md:max-h-180">
	<div class="absolute inset-0 flex flex-col w-full h-full overflow-hidden">
		<h4 class="relative justify-center flex-shrink-0 w-full pt-4 pb-3 text-sm text-center md:(pt-8 pb-5 text-2xl) border-b-1 border-base-dark border-opacity-10">
			<slot name="header">配信設定</slot>
		</h4>
		{#if !selectedDistribution }
			{#await promise}
				<div
					class="relative flex flex-col flex-1 items-center justify-center inset-x-0 px-4 overflow-y-auto">
					<h5 class="fi-text mt-8 text-xl opacity-60">読み込み中です</h5>
					<div class="mt-4">
						<Loading fill="#666" size="24"/>
					</div>
				</div>
			{:then _}
				{#if !upComings.length }
					<div
						class="relative flex flex-col flex-1 items-center justify-center inset-x-0 px-4 overflow-y-auto">
						<h5 class="fi-text mt-8 text-xl font-bold">配信予約がありません</h5>
						<Button class="mt-20 min-h-8" text outlined on:click={ onClickedGotoStudio }>配信の予約をする</Button>
						<p class="mt-4 text-center text-sm text-base-dark text-opacity-40">※YouTube Studioに移動します</p>
					</div>
				{:else}
					<ul class="relative flex-1 inset-x-0 pb-1 md:pb-2 max-w-full overflow-y-auto overflow-x-hidden">
						{#each upComings as item, index}
							<li class="flex py-5 justify-start items-center relative cursor-pointer"
								on:click={ () => selectedIndex = index }>
								<Radio bind:group={ selectedIndex } value={ index } class="ml-4 md:ml-6"/>
								<div
									class="relative ml-2 md:ml-5 rounded-2xl bg-base-dark overflow-hidden w-35 h-20 md:(w-39 h-22) bg-cover bg-center"
									style="{ `background-image: url(${ item.thumbnailUrl ? item.thumbnailUrl : `/assets/images/thumbs/default${ $dark ? '@dark' : '' }.png` });` }">
								</div>
								<div class="flex flex-1 justify-around self-stretch flex-col pl-6 max-w-115">
									<h4 class="fi-text text-sm md:text-lg">
										{ item.title }
									</h4>
									<p class="my-1 fi-text text-xs md:text-base line-clamp-2 md:line-clamp-1 overflow-hidden">
										{ item.description }
									</p>
									<p>
										<span class="fi-text-sub text-xs">予定開始時刻</span>
										<span
											class="block md:inline-block fi-text text-sm md:ml-5">{ format(new Date(item.scheduledStartAt), 'yyyy/MM/dd HH:mm:ss') }</span>
									</p>
									<p class="<md:hidden">
										<span class="fi-text-sub text-xs">予定終了時刻</span>
										<span class="fi-text text-sm ml-5">{ item.scheduledEndAt || '----' }</span>
									</p>
								</div>
							</li>
							<hr class="fi-border w-full border-t-1 border-base-dark border-opacity-10">
						{/each}
					</ul>
				{/if}
			{/await}
			<div class="relative bottom-0 w-full md:min-h-22">
				<div class="flex flex-wrap justify-center py-4 md:py-8 bottom-0 w-full border-t-1 border-base-dark border-opacity-10">
					<Button class="mt-4 md:mt-8" disabled={ selectedIndex < 0 } on:click={ onSelectedDistribution }>次へ</Button>
				</div>
			</div>
		{:else if !selectedOtherSetting}
			<div class="pt-5 md:pt-12 flex-1 overflow-y-auto flex justify-center">
				<div class="w-full pb-5">
					<p class="pb-8 px-6">
						{#if alreadyLinking}
							すでに連携されている「{ targetDistribution?.title }」でゲームを開始します。
						{:else}
							「{ targetDistribution?.title }」と連携してゲームを開始します。
						{/if}
					</p>
					<SettingUnlistedArea class="mb-6" isGameStart bind:unlisted={asPrivate} />
					<SettingGiftArea isGameStart {gameGiftEnable} bind:isGiftEnable={isGiftEnable} bind:isGiftEffectEnable={isGiftEffectEnable} />
					<div class="mt-9 px-6 pb-6">
						<div>
							キャンペーンコードがある場合は入力してください。
						</div>
						<form class="mt-3 mb-1 flex flex-row justify-center">
							<!-- NOTE: dummy input for prevent autocomplete -->
							<input type="password" class="fixed -left-100 -top-100 w-25 h-4" />
							<input type="password" class="fixed -left-100 -top-100 w-25 h-4" />
							<TextField
								class="h-56px w-full flex-grow"
								on:keypress={onKeypressInput}
								on:keyup={onKeyupInput}
								bind:value={campaignCode}
								bind:input={input}
								on:blur={checkCampaignCode}
								password={masked}
								error={!!campaignCodeError.length}
								placeholder="キャンペーンコードを入力"
								inputClass="text-base"
								block
								maxlength={ maxlength +1 }
							/>
							<Button
								class="mx-1 p-2"
								text
								nogutters
								on:click={() => masked = !masked}
							>
								<i class="text-2xl icon {masked ? 'fingger-visible' : 'fingger-invisible'}" />
							</Button>
						</form>
						{#if campaignCodeError.length}
							<div class="text-center text-error-light dark:text-error-dark">
								{campaignCodeError}
							</div>
						{:else if campaignCodeName.length}
							<div class="text-center">
								{campaignCodeName}を適用しました
							</div>
						{/if}
					</div>
				</div>
			</div>
			<hr>
			<div class="flex justify-center pt-7 pb-8">
				{#if upComings.length > 1}
					<Button text class="mr-9" on:click={ deselectDistribution }>戻る</Button>
				{/if}
				<Button disabled={!!campaignCodeError.length} on:click={ gotoTagSetting }>次へ</Button>
			</div>
		{:else}
			<div class="relative flex-1 inset-x-0 pb-1 md:pb-2 max-w-full overflow-y-auto overflow-x-hidden">
				<SettingTagArea isGameStart bind:selectedTags={selectedTags} {bundleId} distribution={ upComings[selectedIndex] } {allTags} />
			</div>
			<hr>
			<div class="flex justify-center pt-7 pb-8">
				<Button text class="mr-9" on:click={ gotoOtherSetting }>戻る</Button>
				<Button disabled={!!campaignCodeError.length || selectedTags.length == 0 || selectedTags.length > maxTagLength} on:click={ onClickedAccept }>開始する</Button>
			</div>
		{/if}
	</div>
</Modal>