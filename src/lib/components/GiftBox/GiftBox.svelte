<script lang="ts">
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Gift_GiftPurchaseConfirmationPublic as GiftPurchase
	} from '$lib/apis';

	import throttle from 'lodash/throttle';
	import { prepared } from '$lib/stores/user';
	import { trigger } from '$lib/functions/util';
	import { mobile, desktop, portrait, phone } from '$lib/stores/device';
	import { sidebar } from '$lib/stores/ui';
	import { smaller } from '$lib/stores/breakpoint';
	import { strLength } from '$lib/functions/util';
	import { gifts, getThumbnailById } from '$lib/stores/gifts';
	import { GiftsApi } from '$lib/apis';
	import { openModal } from '$lib/components/Login';
	import Modal from '$lib/components/Modal';
	import Avatar from '$lib/components/Avatar';
	// import TextField from '$lib/components/TextField';
	import Button from '$lib/components/Button';
	import GiftPurchaseCard from './GiftPurchaseCard.svelte';

	const maxlength = 60;
	const small = smaller('sm');

	export let distributionUuid:string|null = null;
	export let isGiftEnable = false;
	export let isGiftEffectEnable = false;

	let giftPurchaseModal = false;
	let coinShortageModal = false;

	let selectedGift:GiftPurchase|null;
	let additionalMessage = '';
	let currentCoin = 0;
	let simulatedCoin = 0;
	// let isMessageGift = false;
	let processing = false;
	let errorText:string;

	$: errorText = strLength(additionalMessage) > maxlength ? '入力文字数が多すぎます。'
			: additionalMessage.match(/^\s+$/) ? 'スペースのみでは送信できません。'
			: '';

	$: isFillTarget = $mobile || $small;

	// NOTE: Headerに配置してある PurchaseCoinModal を開く
	function dispatchPurchaseModal() {
		trigger('purchase-openmodal');
	}

	async function onSelectGift(giftId:string) {
		if(!$prepared) {
			openModal();
			return;
		}
		await GiftsApi.postApiV1GiftsGetpurchaseconfirmation({ giftId })
			.then(data => {
				if( !data ){
					return;
				}
				selectedGift = data;
				currentCoin = selectedGift.currentUserBalance ?? 0;
				simulatedCoin = selectedGift.afterUserBalance ?? 0;
				// isMessageGift = false;
				giftPurchaseModal = true;
			})
			.catch(console.error);
	}

	async function onPurchaseGift() {
		if (simulatedCoin < 0) {
			giftPurchaseModal = false;
			coinShortageModal = true;
			return;
		}
		processing = true;
		const giftSellingId = selectedGift?.giftSellingId ?? 0;
		const giftName = selectedGift?.name ?? '';
		const giftId = selectedGift?.giftId ?? '';
		const giftInfo = $gifts.find((item) => item.giftId == giftId);
		await GiftsApi.postApiV1GiftsPurchase({
				giftSellingId,
				requestBody: {
					distributionUuid,
					additionalMessage
				}
			})
			.then(() => {
				// コメント欄に即時反映させる
				trigger('sent-gift', {
					comment:`${giftName}を贈りました！`,
					gift:{
						GiftId: giftId,
						Price: giftInfo?.price,
						Tier: giftInfo?.tier
					}
				});
				// コイン消費後のコイン所持数を反映させる
				trigger('user-update');
			})
			.catch(() => {
				trigger('send-error-comment', 'ギフトが贈れませんでした。');
			})
			.finally(() => {
				additionalMessage = '';
				processing = false;
				giftPurchaseModal = false;
			});
	}

	function onKeypressCommentInput(e) {
		if (additionalMessage.length && !errorText.length && e.charCode === 13) {
			onPurchaseGift();
		}
	}
</script>
<div class="flex flex-row justify-center">
	<!-- NOTE: PC向け / SP・TB縦向き で配置数を調整（SP・TB横向きは3列固定)　-->
	<div class="pt-2 inline-grid gap-4 \
		{ $desktop
			? ($sidebar
				? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-11 4xl:grid-cols-17 5xl:grid-cols-23 6xl:grid-cols-28'
				: 'grid-cols-3 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-10 3xl:grid-cols-13 4xl:grid-cols-19 5xl:grid-cols-25 6xl:grid-cols-31'
			)
			: ($phone && $portrait) ? 'grid-cols-3 sm:grid-cols-5 md:grid-cols-3'
			: 'grid-cols-3'
		}">
		{#each $gifts as { thumbnailImageUrl, price, giftId }}
			<GiftPurchaseCard
				thumbnail={ thumbnailImageUrl ?? '' }
				{price}
				on:selectGift={ () => onSelectGift(giftId ?? '') }
			/>
		{/each}
	</div>
</div>

<!-- ギフト詳細モーダル -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal
	bind:active={giftPurchaseModal}
	on:accept={ throttle(onPurchaseGift, 500, {trailing: false}) }
	fill
	rounded="lg"
	class="md:w-480px text-sm md:my-8"
	closeWithNavigate={false}
	innerClass={ isFillTarget ? 'flex flex-col justify-center' : '' }
>
	<div class="pt-5 px-6 flex flex-col justify-center">
		<Avatar class="mx-auto" rounded="none" size="64" thumbnail={ getThumbnailById(selectedGift?.giftId ?? '') }/>
		<h4 class="mt-3 mb-5 text-center font-bold">{ selectedGift?.name }</h4>
		<div class="flex focus:outline-none items-center justify-center">
			<img class="mr-1" src="/assets/images/icons/coin.svg" width="22" height="22" alt="coin"/>
			<span class="inline-block font-bold">{ selectedGift?.price }</span>
		</div>
		<p class="text-center py-4">
			<a class="py-0.5 text-xs" href={ import.meta.env.url_specific_trade_law } target="_blank">「特定商取引法に基づく表記」へ</a>
		</p>
	</div>
	<hr class="border-t-1"/>
	{#if isGiftEnable}
		{#if ! isGiftEffectEnable}
			<div class="flex justify-center pt-4 pb-2 px-4">
				<p class="note fi-lb-strict"><span class="xs:block">※ この配信ではギフトを贈ることはできますが、</span>演出は表示されません。</p>
			</div>
		{/if}
		<p class="mt-3 text-center">「{ selectedGift?.name }」を贈りますか？</p>
		<div class="flex flex-glow-0 items-center w-50 m-auto my-4">
			<img src="/assets/images/icons/coin.svg" alt="coin" width="22" height="22"/>
			<div class="flex-grow text-right font-bold">{ currentCoin }</div>
			<i class="fi-text-sub mx-2 flex-shrink-0 flex-grow-0 icon fingger-arrow-right text-2xl"></i>
			<div class="flex-grow text-right font-bold { simulatedCoin < 0 ? 'text-error-dark' : ''}">{ simulatedCoin }</div>
		</div>
	{:else}
		<div class="flex justify-center pt-4 pb-2 px-4">
			<p class="note"><span class="xs:block">※ この配信ではギフト機能がOFFになっているため</span>ギフトは贈れません。</p>
		</div>
	{/if}
	<div class="flex items-center bottom-0 px-4 w-full h-60px bg-white dark:bg-gray-800 py-2 { errorText.length ? 'mb-5' : '' }">
		<!-- {#if isMessageGift}
			<TextField block fill class="flex-1 min-w-0 fi-text-sub flex-grow"
				bind:value={ additionalMessage }
				error={ errorText.length }
				errorText={ errorText }
				placeholder="コメントを入力できます"
				maxlength={ maxlength +1 }
				disabled={ ! isGiftEnable || processing }
				on:keypress={onKeypressCommentInput}>
			</TextField>
			<Button disabled={ errorText.length || ! isGiftEnable || processing } loading={processing} on:click={ throttle(onPurchaseGift, 500, {trailing: false}) } class="ml-2 px-0 md:px-0 min-w-16">
				贈る
			</Button>
		{:else} -->
		<Button disabled={ ! isGiftEnable || processing } loading={processing} on:click={ throttle(onPurchaseGift, 500, {trailing: false}) } class="mx-auto">
			贈る
		</Button>
		<!-- {/if} -->
	</div>
</Modal>

<!-- 所持コイン不足モーダル -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal closeable={false} cancelable acceptable rounded="lg" class="w-70"
	bind:active={coinShortageModal}
	on:accept={dispatchPurchaseModal}
	closeWithNavigate={false}
>
	<div class="p-6 pb-4 text-sm">
		所持コインが足りません。
		<br>
		コインを購入しますか？
	</div>
	<span slot="accept">購入する</span>
</Modal>

<style>
	.note {
		background-color : #C61B5D1F;
		@apply text-error-dark text-center text-base m-auto px-4 py-2 rounded-4px;
	}
	:global(.dark) .note {
		@apply text-error-light;
	}
</style>
