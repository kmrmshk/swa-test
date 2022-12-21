<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import get from 'lodash/get';
	import map from 'lodash/map';
	import filter from 'lodash/filter';
	import mapKeys from 'lodash/mapKeys';
	import camelCase from 'lodash/camelCase';

	import TabNav from '$lib/components/Tabs/TabNav.svelte';
	import TabNavItem from '$lib/components/Tabs/TabNavItem.svelte';
	import Tabs from '$lib/components/Tabs/Tabs.svelte';

	import CommentViewer from '$lib/components/CommentViewer';
	import SupporterRankList from '$lib/components/SupporterRankList';

	import { ProductsApi, GamesApi, UsersApi, ContentServerApi } from '$lib/apis';
	import { uuid, channel, thumbnailUrl, prepared } from '$lib/stores/user';
	import { mobile, landscape, portrait } from '$lib/stores/device';
	import { larger } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import { createHistory, items, erase, comments, commentQueue } from '$lib/stores/distributions';
	import { onDestroy, tick } from 'svelte';
	import { parseTextLink, strTrim } from '$lib/functions/util';
	import { fetchByDistributionId } from '$lib/stores/gifts';
	import ContentsReportModalSet from '$lib/components/ContentsReportModalSet';
	import LiveFeatureContents, { TabOverview, TabItems, TabDistribution, TabComment, TabRanking, TabGift } from '$lib/components/LiveFeatureContents';
	import { getAuthTokens } from '$lib/services/auth';
	import { EmbedVideoPlayer, SocialSharingModal, DistributionNaviBar, CustomFrame } from '$lib/components/DistributionView';

	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetailPublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic as TagPublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Game_GameCustomFramePublic as CustomFramePublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductPublic as ProductPublic
	} from '$lib/apis';

	type CreateHistoryType = ReturnType<typeof createHistory>;

	export let data:PageData;

	const large = larger('md');
	const medium = larger('sm');
	const assetBase = `${ import.meta.env.asset_endpoint }`;
	const cdnHost = `${ import.meta.env.distribution_streaming_endpoint }`;
	const baseJson = 'base.json';
	const embedPlayerMaxHeight = 10000;
	const fetchingInterval = 1500;

	// 状態に応じてタブの構成をそれぞれ定義しておく
	const TabGroupSimple = [ TabOverview, TabGift, TabDistribution ];
	const TabGroupWithProduct = [ TabOverview, TabItems, TabGift, TabDistribution ];

	let streamUuid:string;
	let distribution:DistributionDetailPublic;

	let fetchingIntervalId = -1;
	let renderingIntervalId = -1;

	let bundleId = '';
	let title = '';
	let description = '';
	let viewCount = 0;
	let channelName = '';
	let channelThumb = '';
	let broadcastId = '';
	let official = false;
	let distributorUuid = '';
	let isGiftEnable = false;
	let isGiftEffectEnable = false;
	let products:Array<ProductPublic> = [];
	let usedItems:CreateHistoryType;
	let commentIndex = -1;
	let commentIndexList:Array<number> = [];
	let commentViewer:CommentViewer|null = null;
	let inputable = false;
	let hasProducts = false;
	let report:ContentsReportModalSet|null = null;
	let targetTab = 'Overview';
	let targetTab2 = 'Comments';
	let likeCount = 0;
	let shareModal = false;
	let tags:Array<TagPublic> = [];

	let customFrameElem:CustomFrame|null = null;
	let customFrameInfo:CustomFramePublic|null = null;
	let isActiveCustomFrame = false;
	let playerMaxHeight = embedPlayerMaxHeight;

	$: ({ streamUuid, distribution } = data);
	$: baseUrl = `${ cdnHost }/${ streamUuid }/platform/`;
	$: if (streamUuid) {
		resetPage();
	}
	$: if (bundleId) {
		fetchProducts();
		fetchGameInfo();
		customFrameElem?.reset();
	}
	$: if(commentViewer) {
		resetViewer();
	}
	$: asMobile = ($mobile && $portrait && $medium) || ( $mobile && $landscape); //横２カラム想定（TB）
	$: asBroadPC = !$mobile && $large; //３エリア想定（PC）
	// 状態に応じて表示グループを変える
	$: tabCommonColumns = hasProducts ? TabGroupWithProduct : TabGroupSimple;
	$: tabRightColumns = asBroadPC
		? [ TabComment, TabRanking ]
		: [ TabComment, ...tabCommonColumns, TabRanking ];
	// NOTE: 動画プレイヤーの大きさは、低解像度 かつ 縦向きのとき小さくする
	$: if($landscape || $portrait) {
		playerMaxHeight = isActiveCustomFrame && !$large && $portrait
			? 100
			: embedPlayerMaxHeight;
	}
	// NOTE: giftタブが非アクティブであっても gift 情報を取得しておく
	$: if (streamUuid && $prepared) {
		fetchByDistributionId(streamUuid);
	}

	onDestroy(() => {
		stopFetchingComments();
		abortRender();
	});

	function configureCommentRender(interval:number) {
		let renderingInterval = interval / Math.max(1, $commentQueue.length); // ms
		abortRender();
		if(browser) {
			renderingIntervalId = window.setInterval(insertComment, renderingInterval);
		}
	}

	function insertComment() {
		let item = $commentQueue.shift();
		if (item) {
			$comments.push(item);
			if( item.UserUuid !== $uuid ||
				item.SuperChatDetails !== null ||
				item.Item?.Uuid ||
				item.MembershipChatDetails !== null
			){
				commentViewer?.addComment(item);
			}
		}
		$comments = $comments;
		if ($comments.length > 1000) {
			$comments.shift();
		}
	}

	function startFetchingComments() {
		stopFetchingComments();
		if(browser) {
			fetchingIntervalId = window.setInterval(fetchComments, fetchingInterval);
		}
	}
	function stopFetchingComments() {
		browser && window.clearInterval(fetchingIntervalId);
	}

	function abortRender() {
		browser && window.clearInterval(renderingIntervalId);
	}

	async function resetPage() {
		$comments = [];
		$commentQueue = [];
		commentIndex = -1;
		commentIndexList = [];
		usedItems = createHistory(streamUuid);
		broadcastId = get(distribution, 'youTube.broadcastId', '');
		distributorUuid = distribution.distributorUuid ?? '';
		isGiftEnable = distribution.isGiftEnable ?? false;
		isGiftEffectEnable = distribution.isGiftEffectEnable ?? false;
		if(isGiftEnable) {
			targetTab = 'Gift';
		}
		tags = distribution.tags ?? [];
		UsersApi
			.getApiV1Users({
				uuid: distributorUuid
			})
			.then(({thumbnailUrl, youTubeChannelTitle}) => {
				channelThumb = thumbnailUrl ?? '';
				channelName = youTubeChannelTitle ?? '';
			})
			.catch(console.error);

		if(browser) {
			abortRender();
			startFetchingComments();
			configureCommentRender(5000);
			updateDistribution(distribution);
		}
	}

	function updateDistribution(distribution) {
		// NOTE: DistributionWorkerはプロパティ名がキャピタライズされてるので矯正しておく
		const d = mapKeys(distribution, (v, k) => camelCase(k));
		if (d.status !== 'Live' && d.status !== 'Upcoming') {
			setTimeout(() => erase(streamUuid), 500);
			goto(`/archives/${ d.uuid }`);
			return;
		}
		inputable = d.status === 'Live';
		bundleId = d.bundleId;
		title = d.title;
		description = d.description;
		viewCount = d.concurrentViewers;
		official = d.isOfficial;
		likeCount = d.likeCount;
		isGiftEnable = d.isGiftEnable;
		isGiftEffectEnable = d.isGiftEffectEnable;
	}

	async function fetchProducts() {
		await ProductsApi.getApiV1ProductsGames({ bundleId })
			.then(data => {
				if (!data) {
					return;
				}
				products = data;
				hasProducts = !!data.length;
			})
			.catch(console.error);
	}

	function fetchGameInfo() {
		return GamesApi.getApiV1Games({ bundleId })
			.then(data => {
				if (!data) {
					return;
				}
				customFrameInfo = data.gameCustomFrame;
			})
			.catch(console.error);
	}

	async function fetchComments() {
		const isBase = commentIndex < 0;
		let targetUrl = baseUrl + (isBase ? baseJson : `${ commentIndex }.json`) + '?' + Date.now();
		await fetch(targetUrl)
			.then(res => {
				if(!res.ok) {
					throw new Error(res.statusText);
				}
				return res.json().catch(_ => {});
			})
			.then(data => {
				if (!data || commentIndexList.includes(data.Id)) {
					return;
				}
				commentIndexList.push(data.Id);
				const invisible = document.visibilityState !== 'visible';
				const arr = (data.Comments ?? []).map((comment) => ({
					...comment,
					Message: parseTextLink(comment.Message, true, false, true)
				}));
				const next = new Date(data.NextFetchableAt ?? +new Date).getTime();
				// 視聴ユーザ自身が使用したアイテムを抽出
				const usedItems = filter(arr, c => c.Item?.UserUuid === $uuid);
				// 自身のギフトコメントを除外
				const additions = isBase ? arr : filter(arr, c =>
					!(c.UserUuid == $uuid && c.Gift)
				);
				if (isBase) {
					$comments = [...additions];
					commentViewer?.setComments(additions);
				} else if (invisible) {
					$comments.push(...additions);
					commentViewer?.setComments($comments);
				} else {
					$commentQueue.push(...additions);
				}
				// NOTE: 初期コメント情報取得時、画面復帰時はコメントビューアをリセット
				if(isBase && !invisible) {
					commentViewer?.resetScrollPosition();
				}
				updateUsingItems(map(usedItems, c => ({ uuid: c.Uuid, product: c.Item })));
				updateDistribution(get(data, 'Distribution', {}));
				configureCommentRender(Math.max(fetchingInterval, next - Date.now()));
				commentIndex = (isBase ? (data.Id ?? 0) : commentIndex) + 1;
			})
			.catch(console.error)
	}

	function updateUsingItems(list) {
		list.forEach(item => {
			if (!$usedItems.includes(item.uuid)) {
				items.sub(item.product.ProductId);
			}
			usedItems.push(item.uuid);
		});
	}

	async function resetViewer() {
		await tick();
		commentViewer?.setComments($comments);
		commentViewer?.resetScrollPosition();
	}

	function addComment({ Message='', Gift=null, error='' }) {
		const data = {
			Uuid: `${ Date.now() }_${ Math.random() * 100000000 >> 0 }`,
			AuthorDisplayName: $channel.title,
			Message,
			Price: 0,
			Item: null,
			UserUuid: $uuid,
			UserThumbnail: $thumbnailUrl,
			SuperChatDetails: null,
			MembershipChatDetail: null,
			Gift,
			error
		};
		if (commentViewer) {
			commentViewer?.addComment(data);
		}
		return data;
	}

	function onConsumedItem({ detail }) {
		// GachaPartitionBoxではまだUuidが特定できないためデクリメント不可
		// 合わせてメッセージもデクリメントできない以上表示はできない
		// usedItems.push(detail.uuid);

		// コメント一覧に追加しておく
		if (commentViewer) {
			commentViewer.addCommentByString(`${ detail }`);
		}
	}

	function onSentGift({ detail }) {
		const data = addComment({
			Message: `${ detail.comment }`,
			Gift: detail.gift
		});
		$comments.push(data);
	}

	function onSendErrorComment({ detail }) {
		addComment({
			error: `${ detail }`
		});
	}

	function onChangedVisibility() {
		const invisible = document.visibilityState !== 'visible';
		if(!invisible) {
			resetViewer();
		}
	}

	async function onRequestedFromCustomFrame() {
		const tokens = await Promise.all([
			getAuthTokens(),
			ContentServerApi.getApiV1ContentserverToken({ bundleId })
		]).then(([authTokens, jwtToken]) => ({
			youtube: authTokens?.accessToken ?? '',
			content: jwtToken ?? ''
		}));
		const params = {
			distributionId: streamUuid,
			distributorId: distributorUuid,
			userId: $uuid,
			channelId: $channel?.id ?? '',
			userName: strTrim($channel?.title, 24),
			userThumbnailUrl: $thumbnailUrl,
			tokens
		};
		customFrameElem?.transfer(params);
	}
</script>

<svelte:window on:visibilitychange={ onChangedVisibility } on:consumed-item={ onConsumedItem } on:sent-gift={ onSentGift } on:send-error-comment={ onSendErrorComment } />

<article class="flex { (asMobile || asBroadPC) ? 'flex-row' : 'flex-col' } content-start absolute inset-0 overflow-hidden">
	<div class="flex flex-col relative w-full w-auto"
		class:overflow-scroll={ asBroadPC }
		class:flex-grow={ asMobile || asBroadPC }>
		<EmbedVideoPlayer
			{broadcastId}
			distributionUuid={ streamUuid }
			maxHeight={ playerMaxHeight }
		/>
		<!-- NOTE: アイテム・ギフトなどのモーダルを下段領域に表示するために、最低限必要な高さを指定しておく -->
		<div class="flex-1 relative">
			<DistributionNaviBar
				onAir={true}
				distributionUuid={ streamUuid }
				{distributorUuid}
				{title}
				{viewCount}
				{channelName}
				{channelThumb}
				{official}
				{likeCount}
				{isGiftEnable}
				{isGiftEffectEnable}
				on:report={ ({ detail }) => report?.openAsDistribution(detail)}
				on:share={ () => shareModal = true }
			/>
			<!-- 高解像度のときのみガチャのタブを動画プレイヤーの下に表示 -->
			{#if asBroadPC}
				{#key hasProducts }
					<Tabs bind:value={targetTab} segmented swipe={true} class="flex-wrap">
						<div class="flex py-3 m-auto max-w-9/10 relative z-0">
							<TabNav>
								{#each tabCommonColumns as item}
									<TabNavItem value={item.value}>{ item.name }</TabNavItem>
								{/each}
							</TabNav>
						</div>
						<div class="px-4 pb-4 w-full">
							<LiveFeatureContents bind:mode={targetTab} list={tabCommonColumns} {description} distributionUuid={streamUuid} {bundleId} {isGiftEnable} {isGiftEffectEnable} {tags}/>
						</div>
					</Tabs>
				{/key}
			{/if}
			<SocialSharingModal
				bind:active={ shareModal }
				href={ $page.url.href }
				text={ title }
			/>
		</div>
	</div>

	<div
		class="wrapper flex flex-col flex-grow relative max-h-full h-full border-base-dark dark:border-white border-opacity-10 dark:border-opacity-12 \
			{asBroadPC ? 'min-w-360px max-w-360px border-l-1':''} \
			{asMobile ? 'min-w-375px max-w-375px border-l-1':''}"
		class:flex-shrink-0={ asMobile }
		class:dark={ $dark }
	>
		{#if customFrameInfo}
			<!-- NOTE: offset = コメント入力欄 ※ただしコメントタブを表示しているときのみ -->
			<CustomFrame
				bind:this={ customFrameElem }
				class={ (isActiveCustomFrame && !asBroadPC) ? 'absolute top-0 z-2 border-t-0' : '' }
				offset={ !asBroadPC && targetTab2 === 'Comments' ? 56 : 1 }
				on:open={ () => isActiveCustomFrame = true }
				on:close={ () => isActiveCustomFrame = false }
				on:request-params={ onRequestedFromCustomFrame }
				on:send-comment={ ({detail}) => {commentViewer?.sendComment(detail?.comment, true)} }
				frameWidth={ customFrameInfo.minWidth }
				frameHeight={ customFrameInfo.minHeight }
				src={ `${ assetBase }/games/${ bundleId }/controller/index.html?${ Date.now() }` }
			/>
		{/if}
		<!-- 右側のカラムのタブ切り替え表示 -->
		{#key `${hasProducts}${asBroadPC}` }
			<Tabs bind:value={targetTab2} class="flex flex-col relative w-full" swipe>
				<div class="header">
					<TabNav class="justify-center">
						{#each tabRightColumns as item}
							<TabNavItem value={item.value}>{ item.name }</TabNavItem>
						{/each}
					</TabNav>
				</div>
				<LiveFeatureContents bind:mode={targetTab2} list={tabRightColumns} {description} distributionUuid={streamUuid} {bundleId} {isGiftEnable} {isGiftEffectEnable} {tags}>
					<svelte:fragment slot="comments">
						<CommentViewer
							on:report={ ({ detail }) => report?.openAsComment(detail) }
							bind:this={ commentViewer }
							{streamUuid}
							{inputable}
						/>
					</svelte:fragment>
					<svelte:fragment slot="ranking">
						<SupporterRankList {streamUuid}/>
					</svelte:fragment>
				</LiveFeatureContents>
			</Tabs>
		{/key}
		<!-- 動画、コメントの報告用モーダル -->
		<ContentsReportModalSet bind:this={ report } />
	</div>
</article>

<style lang="scss">
	.overflow-scroll {
		@apply overflow-auto overflow-y-scroll;
	}

	article {
		.wrapper :global(.fi-tabs) {
			@apply h-full;
		}

		:global(.header) {
			@apply bg-white row-start-1 border-base-dark border-b-1 border-opacity-12;
		}

		:global(.wrapper.dark .header) {
			@apply bg-gray-800 border-white border-b-1 border-opacity-12;
		}
	}
</style>
