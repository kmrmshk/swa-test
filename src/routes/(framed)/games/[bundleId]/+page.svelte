<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import get from 'lodash/get';
	import findIndex from 'lodash/findIndex';

	import { DistributionsApi, GamesApi, UsersApi, TagsApi } from '$lib/apis';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameScreenShotPublic as GameScreenShotPublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionYouTubePublic as DistributionYoutube,
		FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionMePublic as DistributionMe,
		FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic as Tag
	} from '$lib/apis';
	import { prepared, diamondAccumulatedAt, remainingExchangeableDays} from '$lib/stores/user';
	import { mobile } from '$lib/stores/device';
	import { notify, openPopup, sleep } from '$lib/functions/util';

	import Card from '$lib/components/Card';
	import Button from '$lib/components/Button';
	import Modal from '$lib/components/Modal';
	import Image from '$lib/components/Image';
	import Metatags from '$lib/components/Metatags';
	import { ReservationSelectingModal } from '$lib/components/DistributionSettings';
	import ActivateModalSet, { checkActivated } from '$lib/components/ActivateModalSet';
	import { GameDistributionList } from '$lib/components/LiveFeatureContents';
	import { openModal } from '$lib/components/Login';
	import { authorized } from '$lib/services/auth';

	const origin = $page.url.origin;
	const exchangeWarningDays = 180 - 150;
	const STATUS_NORMAL = '';
	const STATUS_EXPIRED = 'expired';
	const STATUS_WARNING = 'warning';
	const defaultWindowWidth = 1280;
	const defaultWindowHeight = 720;
	const externalManualUrl = import.meta.env.url_distribution_manual;

	export let data:PageData;
	let bundleInfo = data.bundleInfo;

	let popup:Window|null;
	let processing = false;
	let alreadyLinking = false;
	let selectedIndex = -1;
	let ytList:Array<DistributionYoutube> = [];
	let fiList:Array<DistributionMe> = [];
	let upComings:Array<DistributionMe|DistributionYoutube> = [];
	let screenshots:Array<GameScreenShotPublic> = [];

	let upComingsPromise:Promise<void>;
	let upComingsModal = false;
	let licenseModal = false;
	let howtoModal = false;
	let targetDistUuid = '';
	let asPrivate = false;
	let isGiftEnable = false;
	let isGiftEffectEnable = false;
	let gameGiftEnable = false;
	let campaignCode = '';
	let selectedTags:Array<Tag> = [];
	let activateModal = false;
	let serviceExpired = false;
	let fetchedService = false;
	let licenseText = '';
	let allTags:Array<Tag> = [];

	let diamondStatus = STATUS_NORMAL;
	let diamondModal = false;

	$: if (bundleInfo?.bundleId) {
		fetchedService = true;
		if( $remainingExchangeableDays < 0 ){
			diamondStatus = STATUS_EXPIRED;
		}
		else if( $remainingExchangeableDays <= exchangeWarningDays ){
			diamondStatus = STATUS_WARNING;
		}
		serviceExpired = bundleInfo.currentTime >= bundleInfo.serviceEndAt;
		gameGiftEnable = bundleInfo.isGiftEnable ?? false;
		fetchScreenshots();
		fetchLicenseText();
		fetchTags();
	} else {
		fetchedService = false;
	}
	$: privacyStatus = asPrivate ? 'Unlisted' : 'Public';

	async function attemptStartGame() {

		if(!$prepared) {
			openModal();
			return;
		}

		if( await checkActivated() ){
			activateModal = true;
			return;
		}

		await fetchUsersMe();
		if(diamondStatus == STATUS_EXPIRED){
			diamondModal = true;
			return;
		}

		isGiftEnable = isGiftEffectEnable = gameGiftEnable;
		upComingsPromise = fetchUpComings();
		upComingsModal = true;
		await upComingsPromise;
		if( selectedIndex > -1 && upComings[selectedIndex]?.campaign?.campaignCode){
			campaignCode = upComings[selectedIndex]?.campaign?.campaignCode ?? '';
			isGiftEnable = upComings[selectedIndex]?.isGiftEnable && gameGiftEnable;
			isGiftEffectEnable = upComings[selectedIndex].isGiftEffectEnable && gameGiftEnable;
		} else {
			campaignCode = '';
		}
	}

	function reloadListener({ data }) {
		if(get(data, 'type') === 'PFRequestGameInfo') {
			popup?.postMessage({
				type: 'PFGameInfo',
				info: bundleInfo
			}, origin);
		}
	};

	async function openGame(soloPlay:boolean = false) {
		const width = get(bundleInfo, 'gameWebGlSettings.screenSizeWidth', defaultWindowWidth);
		const height = get(bundleInfo, 'gameWebGlSettings.screenSizeHeight', defaultWindowHeight);
		const params = new URLSearchParams();

		params.set('distribution', soloPlay ? '0' : targetDistUuid);
		params.set('mode', soloPlay ? '1' : '0');

		popup = openPopup(`${ $page.url.pathname }/play?${ params.toString() }`, { width, height }, 'fingger-game');

		new Promise((resolve, reject) => {
			const listener = (e:any) => {
				const data = e.data;
				window.removeEventListener('message', listener);
				window.clearTimeout(id);
				// NOTE: ポップアップウィンドウと連携できた時点でログアウトしていたら失敗扱いにする
				if(!$authorized) {
					reject(false);
				}
				if(get(data, 'type') === 'PFRequestGameInfo') {
					resolve(true);
				}
			};
			const id = window.setTimeout(() => {
				window.removeEventListener('message', listener);
				reject(false);
			}, 5000);
			window.addEventListener('message', listener);
		}).then(() => {
			popup?.postMessage({
				type: 'PFGameInfo',
				info: bundleInfo
			}, origin);

			window.removeEventListener('message', reloadListener);
			window.addEventListener('message', reloadListener);
		}).catch(() => {
			notify('ゲームの起動に失敗しました', 6000);
			popup?.close();
		});
		return popup;
	}

	async function onClickedSoloModePlay() {
		openGame(true);
	}

	async function onClickedLinkedDistribution() {
		const htmlTag = document.querySelector('html');
		let target = upComings[selectedIndex];
		let promise;

		// NOTE: ポップアップを開いた後、起動処理が終わるまでは画面操作を禁止
		htmlTag?.classList.add('pointer-events-none');

		processing = true;
		upComingsModal = false;

		if (!target) {
			console.error('invalid distribution');
			processing = false;
			return;
		}

		const tagIds = selectedTags.map( tag => tag.id );

		if (alreadyLinking) {
			promise = DistributionsApi.postApiV1DistributionsGameplayStart({
					uuid: target.uuid,
					bundleId: bundleInfo?.bundleId
				})
				.then(data => {
					targetDistUuid = data.uuid;
					return DistributionsApi.patchApiV1DistributionsStart({
						uuid: targetDistUuid,
						privacyStatus,
						isGiftEnable,
						isGiftEffectEnable,
						campaignCode,
						requestBody: tagIds
					});
				})
		}
		else {
			promise = DistributionsApi.putApiV1Distributions({
				bundleId: bundleInfo?.bundleId,
				youTubeBroadcastId: target.broadcastId,
				privacyStatus
			})
				.then(data => DistributionsApi.patchApiV1DistributionsStart({
					uuid: data?.uuid ?? '',
					privacyStatus,
					isGiftEnable,
					isGiftEffectEnable,
					campaignCode,
					requestBody: tagIds
				}))
				.then(data => {
					if (data.uuid) {
						targetDistUuid = data.uuid;
						alreadyLinking = true;
						upComings = [ data ];
						selectedIndex = 0;
					}
				});
		}
		promise
			.then(_ => openGame())
			// NOTE: 起動成功時のみ操作無効解除まで遅延時間をもうけておく
			.then(_ => sleep(1000))
			.catch(console.error)
			.finally(() => {
				processing = false;
				// NOTE: ポップアップの処理後画面全体の操作無効を解除
				htmlTag?.classList.remove('pointer-events-none');
			})
	}

	function updateDistributions() {
		alreadyLinking = fiList.length > 0;
		upComings = alreadyLinking ? fiList : ytList;
		//再選択時、選択配信が存在しない場合は未選択にする
		if (upComings[selectedIndex] == null) {
			selectedIndex = -1;
		}
		// 自動選択
		if (upComings.length === 1) {
			selectedIndex = 0;
		}
		// 未選択状態の場合はbundleIdが合致するものを優先して選択
		if (selectedIndex < 0) {
			selectedIndex = findIndex(upComings, t => {
				return t.bundleId === bundleInfo?.bundleId
					&& (t.status === 'Upcoming' || t.status === 'Live')
			});
		}
	}

	function fetchUpComings() {
		processing = true;
		return DistributionsApi.getApiV1DistributionsMyUpcomings({})
			.then(data => {
				if (!data) {
					return;
				}
				fiList = data.finggerDistributions ?? [];
				ytList = data.youTubeDistributions ?? [];
				updateDistributions();
			})
			.then(() => {
				processing = false;
			})
			.catch(console.error);
	}

	function fetchUsersMe() {
		return UsersApi.getApiV1UsersMe()
			.then(data => {
				// 最新のダイヤ情報を改めて取得。
				diamondAccumulatedAt.set(data.diamondAccumulatedAt ? new Date(data.diamondAccumulatedAt) : null);
			})
			.catch(console.error);
	}

	function fetchScreenshots() {
		return GamesApi.getApiV1GamesScreenshots({ bundleId: bundleInfo?.bundleId })
			.then(data => screenshots = data)
			.catch(console.error);
	}

	function fetchLicenseText() {
		return fetch(bundleInfo?.licenseUrl ?? '')
			.then(async res => {
				if(!res.ok) {
					throw Error();
				}
				licenseText = await res.text();
			})
			.catch(() => {
				licenseText = '読み込みに失敗しました';
			});
	}

	async function fetchTags(){
		allTags = await TagsApi.getApiV1Tags1({
			limit: 1000,
			offset: 0
		});
	}

	onDestroy(()=>{
		browser && window.removeEventListener('message', reloadListener);
	});
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	image={ bundleInfo?.thumbnailImageUrl }
	title="{ bundleInfo?.title } | トップ"
	description="{ bundleInfo?.title } | トップ"
/>

<header class="pb-4 bg-white dark:bg-gray-800">
	<div class="m-auto flex items-start justify-start max-w-xl md:max-w-5xl">
		<div class="hidden md:block my-4 ml-8 min-w-311px">
			<Card
				class="block w-full aspect-w-16 aspect-h-9 rounded-xl shadow-01dp bg-cover bg-center"
				style="background-image: url({ bundleInfo?.thumbnailImageUrl });">
			</Card>
		</div>
		<p class="fi-article flex-1 <md:(px-4 pt-3 pb-4 min-h-96px text-sm) md:(mx-6 mt-4 pt-2 pr-2 pb-4 max-h-44 text-base overflow-y-scroll)">
			{@html bundleInfo.description || ''}
		</p>
	</div>
	<div class="m-auto flex flex-row flex-1 justify-between max-w-5xl">
		<Button class="self-end ml-6 h-auto" text on:click={() => licenseModal = true }>ライセンス表記</Button>
		<div class="pr-4 flex items-start justify-end flex-wrap flex-shrink-0 gap-3 md:flex-nowrap w-1/2 md:w-2/3">
			{#if !$mobile}
				<Button disabled={processing || serviceExpired || !fetchedService} loading={processing} class="w-full max-w-46" on:click={ attemptStartGame }>
					{#if serviceExpired }
						サービス終了しました
					{:else}
						ゲームスタート
					{/if}
				</Button>
			{/if}
			<Button on:click={() => howtoModal = true} class="w-full max-w-46" outlined text>
				遊び方
			</Button>
			{#if !$mobile}
				<Button on:click={() => window.open(externalManualUrl, '_blank')} class="w-full max-w-46" outlined text>
					配信マニュアル
				</Button>
			{/if}
		</div>
	</div>
	{#if diamondStatus != ''}
		<p class="m-auto pt-2 text-sm text-right text-error-dark dark:text-error-ligh max-w-5xl">
			{#if diamondStatus == STATUS_WARNING}
				ダイヤの換金期限が残り{$remainingExchangeableDays}日です。期限を過ぎるとゲームプレイが行えなくなります。
			{:else}
				ダイヤの換金期限が過ぎています。現在ゲームプレイを行えません。ダイヤを換金してください。
			{/if}
		</p>
	{/if}
</header>

<section class="px-4 pb-4 m-auto">
	<GameDistributionList
		useCategory
		bundleId={ bundleInfo?.bundleId }
		gridOptions="sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-7 5xl:grid-cols-8 6xl:grid-cols-10"
	/>
</section>

<Modal fill bind:active={ howtoModal } rounded="xl" class="w-full h-full sm:my-3 md:(rounded-xl w-760px max-h-720px) overflow-hidden">
	<h2 class="pt-4 px-4 h-13 text-sm sm:(pt-7 h-21 text-center text-2xl)">遊び方</h2>
	<hr>
	<div class="absolute px-4 pb-4 top-13 bottom-0 left-0 right-0 md:(px-6 pb-0 top-21 bottom-9) flex flex-col overflow-y-auto">
		{#each screenshots as item}
			<Image class="mt-6 md:mt-3" lazy alt="遊び方" src={ item.imageUrl ?? '' } />
		{/each}
	</div>
</Modal>

<!-- ライセンス表記モーダル -->
<Modal bind:active={ licenseModal } rounded="lg" class="w-640px h-112 max-h-full overflow-hidden">
	<!-- licenseModal content -->
	<h4 class="pt-4 px-6 text-xl">ライセンス表記</h4>
	<pre class="absolute left-0 right-0 top-14 bottom-13 px-6 text-xs overflow-y-auto whitespace-pre-line border-t-1 border-b-1 border-base-dark border-opacity-10">
		{@html licenseText}
	</pre>
</Modal>

<!-- 予約配信一覧の確認画面（仮） -->
<ReservationSelectingModal
	upComings={ upComings }
	bind:active={ upComingsModal }
	bind:asPrivate={asPrivate}
	bind:isGiftEnable={isGiftEnable}
	bind:isGiftEffectEnable={isGiftEffectEnable}
	bind:campaignCode={campaignCode}
	bind:selectedTags={selectedTags}
	{alreadyLinking}
	{gameGiftEnable}
	bundleId={bundleInfo?.bundleId}
	{allTags}
	promise={upComingsPromise}
	on:select={ ({ detail }) => selectedIndex = detail }
	on:solo={ onClickedSoloModePlay }
	on:accepted={ onClickedLinkedDistribution }
/>

<!-- ダイヤの換金を促すモーダル -->
<Modal bind:active={ diamondModal } closeable={false} acceptable cancelable
	on:accept={ () => goto('/my/diamond') }
	class="w-90 rounded-lg">
	<p class="p-6 text-sm">
		ダイヤが払い出し期限を過ぎています。ダイヤの換金申請を行ってください。
		ダイヤの換金申請後ゲームプレイが可能となります。
	</p>
	<span slot="accept">ダイヤへ</span>
</Modal>

<!-- 配信アクティベート -->
<ActivateModalSet bind:active={activateModal} />
