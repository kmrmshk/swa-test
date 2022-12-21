<script lang="ts">
	import get from 'lodash/get';
	import nth from 'lodash/nth';
	import throttle from 'lodash/throttle';
	import Modal from '$lib/components/Modal';
	import Avatar from '$lib/components/Avatar';
	import GachaDrawCard from './GachaDrawCard.svelte';
	import GachaAnimeModal from './GachaAnimeModal.svelte';

	import { GachaApi, ProductsApi } from '$lib/apis';
	import { coin, prepared } from '$lib/stores/user';
	import { trigger } from '$lib/functions/util';
	import { openModal } from '$lib/components/Login';
	import { desktop } from '$lib/stores/device';

	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic as Gacha,
		FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic as Product,
		FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemPublic as Item,
		FinggerPlatform_Server_Shared_DataTransferObjects_Gacha_GachaPublic_GachaContentProductPublic as GachaContentProducts
	} from '$lib/apis';

	export let bundleId;
	export let distributionUuid = null;

	let gachas:Array<Gacha> = [];
	let products:Array<Product> = [];
	let gachaResults:Array<Item> = [];

	let gachaItemsModal = false;
	let gachaEmissionModal = false;
	let gachaDrawModal = false;
	let gachaResultModal = false;
	let coinShortageModal = false;

	let selectedGacha = {};
	let selectedGachaItems:Array<GachaContentProducts> = [];
	let selectedGachaResultIndex = 0;

	$: simulatedCoin = $coin - get(selectedGacha, 'price', 0);
	$: if (bundleId) {
		fetchGachas();
		if($prepared){
			fetchProducts();
		}
	}
	$: iconUrl = get(selectedGacha, 'contents.0.iconUrl', '');

	// NOTE: Headerに配置してある PurchaseCoinModal を開く
	function dispatchPurchaseModal() {
		trigger('purchase-openmodal');
	}

	function fetchGachas() {
		GachaApi.getApiV1GachaGames({ bundleId })
			.then(data => {
				if (!data) {
					return;
				}
				gachas = data;
			})
			.catch(console.error);
	}

	function fetchProducts() {
		ProductsApi.getApiV1ProductsGames({ bundleId })
			.then(data => {
				if (!data) {
					return;
				}
				products = data;
			})
			.catch(console.error);
	}

	function onSelectGachaItems(index, isEmission = false) {
		selectedGachaItems = get(gachas, `${ index }.contents.0.products`, []);
		if (isEmission) {
			gachaEmissionModal = true;
		}
		else {
			gachaItemsModal = true;
		}
	}

	function onSelectGacha(index) {
		if(!$prepared) {
			openModal();
			return;
		}
		selectedGacha = nth(gachas, index) || {};
		gachaDrawModal = true;
	}

	async function onDrawGacha() {
		if (simulatedCoin < 0) {
			coinShortageModal = true;
			return;
		}
		const gachaUuid = get(selectedGacha, 'uuid', '');
		// NOTE: 視聴画面ではコンテンツに通知させるため配信UUIDをつけてガチャドローAPIをリクエストする必要がある
		const successful = await GachaApi.postApiV1GachaDraw({
				gachaUuid,
				distributionUuid: distributionUuid ?? undefined
			})
			.then(data => {
				gachaResults = [ ...data ];
				return !!data;
			})
			.catch(e => {
				return false;
			});

		if(!successful){
			return;
		}
		selectedGachaResultIndex = 0;
		gachaResultModal = true;

		// コイン消費後にコイン所持数、アイテム数を更新させる
		trigger('user-update');
	}
</script>

<div class="grid gap-4 grid-cols-2 {$desktop ? 'lg:grid-cols-3 xl:grid-cols-4' : ''}">
	{#each gachas as item, index}
		<GachaDrawCard
			thumbnail={ item.thumbnailUrl }
			on:selectGacha={ () => onSelectGacha(index) }
			on:gachaItemDetail={ () => onSelectGachaItems(index, false) }
			on:emissionRatio={ () => onSelectGachaItems(index, true) }
		/>
	{/each}
</div>

<!-- ガチャ詳細モーダル -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal closeable={false} acceptable cancelable rounded="lg" class="w-70"
	bind:active={gachaDrawModal}
	closeWithNavigate={ false }
	on:accept={ throttle(onDrawGacha, 500, {trailing: false}) }
>
	<div class="pt-5 px-6 flex flex-col justify-center">
		<Avatar class="mx-auto" rounded="lg" size="64" thumbnail={ iconUrl }/>
		<h4 class="mt-3 text-center text-sm font-bold">{ selectedGacha.name }</h4>
		<p class="mt-4 text-sm min-h-20">{ selectedGacha.price }コインでガチャを引きますか？</p>
	</div>
	<p class="text-center py-2">
		<a class="py-0.5 text-xs" href={ import.meta.env.url_specific_trade_law } target="_blank">「特定商取引法に基づく表記」へ</a>
	</p>
	<hr class="mt-2 mx-2 border-t-1"/>
	<div class="flex items-center px-6 h-13">
		<img src="/assets/images/icons/coin.svg" alt="coin" width="24" height="24"/>
		<div class="fi-text-sub flex-grow text-sm text-right font-bold">{ $coin }</div>
		<i class="fi-text-sub mx-2 flex-shrink-0 flex-grow-0 icon fingger-arrow-right text-2xl"></i>
		<div
			class="flex-grow text-sm text-right font-bold { simulatedCoin < 0 ? 'text-error-dark' : ''}">{ simulatedCoin }</div>
	</div>
</Modal>

<!-- ガチャで手に入るアイテム詳細 -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal
	rounded="lg"
	class="w-90vw h-75vh max-h-75vh sm:max-h-560px md:max-w-530px"
	closeWithNavigate={ false }
	bind:active={gachaItemsModal}
>
	<div class="flex flex-col absolute inset-0 overflow-hidden">
		<h4 class="inline-flex items-center flex-shrink-0 px-6 pt-2 h-12 md:h-15 md:text-xl">アイテム詳細</h4>
		<hr class="relative border-t-1 border-base-dark border-opacity-10">
		<ul class="relative flex-grow inset-x-0 pl-4 overflow-y-auto">
			{#each selectedGachaItems as item}
				<li class="flex justify-between items-start relative pt-2">
					<div class="relative flex-shrink-0 flex-grow-0 mr-2">
						<Avatar rounded="lg" thumbnail="{ item.product?.thumbnailUrl ?? '' }" size="48"/>
					</div>
					<div class="flex flex-col content-around items-start justify-around flex-grow">
						<h4 class="flex-1 pr-4 text-base-dark text-sm font-bold">
							{item.product?.name}
						</h4>
						<h5 class="mt-1 pr-4 text-sm">
							{@html item.product?.description}
						</h5>
						<hr class="mt-2 w-full border-t-1"/>
					</div>
				</li>
			{/each}
		</ul>
		<hr class="relative border-t-1 border-base-dark border-opacity-10">
		<div class="relative px-4 py-3 w-full text-xs">
			<h5 class="leading-6">注意事項</h5>
			<ul>
				<li>※上記アイテム画像はイメージです。</li>
				<li>※ゲーム内で効果が発動できなかった場合は、配信終了後返却されます。</li>
				<li>※ゲーム内で効果が発動した場合は、ゲームの結果にかかわらず消滅します。</li>
			</ul>
		</div>
	</div>
</Modal>

<!-- ガチャのアイテム別提供割合 -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal
	rounded="lg"
	class="w-90vw h-75vh max-h-75vh sm:max-h-440px md:max-w-320px"
	closeWithNavigate={ false }
	bind:active={gachaEmissionModal}
>
	<h4 class="flex items-center flex-shrink-0 px-6 pt-2 h-12 md:(h-15 text-xl)">提供割合</h4>
	<hr class="relative border-t-1 border-base-dark border-opacity-10">
	<ul class="absolute inset-x-0 top-15 bottom-13 pl-4 overflow-y-auto">
		{#each selectedGachaItems as item}
			<li class="flex justify-between items-start relative pt-4 pb-3">
				<h4 class="flex-1 fi-text-sub pr-4 text-sm">
					{item.product?.name}
				</h4>
				<h5 class="pr-4 text-sm line-clamp-2">
					{ ((item.rate ?? 0) * 100).toFixed(2) }%
				</h5>
			</li>
			<hr class="w-full border-t-1"/>
		{/each}
	</ul>
	<hr class="absolute bottom-13 w-full border-t-1 border-base-dark border-opacity-10">
</Modal>

<!-- 所持コイン不足モーダル -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal closeable={false} cancelable acceptable rounded="lg" class="w-70"
	bind:active={coinShortageModal}
	closeWithNavigate={ false }
	on:accept={dispatchPurchaseModal}
>
	<div class="p-6 pb-4 text-sm">
		所持コインが足りません。
		<br>
		コインを購入しますか？
	</div>
	<span slot="accept">購入する</span>
</Modal>

<GachaAnimeModal products={products} results={gachaResults} bind:active={gachaResultModal}/>
