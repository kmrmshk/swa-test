<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import differenceInSeconds from 'date-fns/differenceInSeconds/index.js';
	import { onDestroy } from 'svelte';
	import get from 'lodash/get';
	import map from 'lodash/map';
	import omit from 'lodash/omit';
	import range from 'lodash/range';
	import compact from 'lodash/compact';
	import clamp from 'lodash/clamp';
	import merge from 'lodash/merge';
	import mapValues from 'lodash/mapValues';
	import groupBy from 'lodash/groupBy';
	import flatten from 'lodash/flatten';
	import difference from 'lodash/difference';
	import differenceBy from 'lodash/differenceBy';

	import { TabNav, TabNavItem, Tabs } from '$lib/components/Tabs';

	import { EmbedVideoPlayer } from '$lib/components/DistributionView';
	import LiveFeatureContents, { TabOverview, TabArchives, TabComment } from '$lib/components/LiveFeatureContents';

	import { mobile, landscape, portrait } from '$lib/stores/device';
	import { larger } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import { erase, comments, commentQueue } from '$lib/stores/distributions';
	import { parseTextLink, notify } from '$lib/functions/util';
	import ContentsReportModalSet from '$lib/components/ContentsReportModalSet';
	import CommentViewer, { dummyCommentId } from '$lib/components/CommentViewer';
	import { tick } from 'svelte';
	import { DistributionNaviBar, SocialSharingModal } from '$lib/components/DistributionView';
	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetailPublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_User_UserPublic as UserPublic,
		FinggerPlatform_Server_Shared_DataTransferObjects_Tags_TagPublic as TagPublic
	} from '$lib/apis';

	const large = larger('md');
	const medium = larger('sm');
	const cdnHost = `${ import.meta.env.distribution_streaming_endpoint }`;
	const scopeRange = 5;
	const firstComment = {
		AuthorDisplayName: 'fingger',
		ElapsedTime: -1,
		Item: null,
		Message: 'ここでチャット内容も表示されるよ',
		UserThumbnail: '/assets/images/icons/thumb-comment.png',
		UserUuid: dummyCommentId,
		Uuid: new Date().getTime().toString(16) + Math.floor(10 * Math.random()).toString(16),
	};
	const tabCommonColumns = [ TabOverview, TabArchives ];

	export let data:PageData;
	let streamUuid:string;
	let distribution:DistributionDetailPublic;
	let distributor:UserPublic;

	let pollingTimeoutId = -1;
	let renderingIntervalId = -1;
	let updateTimeIntervalId = -1;
	let bundleId = '';
	let title = '';
	let description = '';
	let viewCount = 0;
	let channelName = '';
	let channelThumb = '';
	let broadcastId = '';
	let distributorUuid = '';
	let finggerDuration = 0;
	let actualStartAt = '';
	let scheduledStartAt = '';
	let isOfficial = false;
	let targetTab = 'Overview';
	let targetTab2 = 'Comments';
	let likeCount = 0;
	let shareModal = false;
	let tags:Array<TagPublic> = [];

	let player;
	let totalId = 0;
	let targetIndex = 0;
	let commentMap = {};
	let commentIndices:Array<number> = [];
	let currentTime = 0;
	let report:ContentsReportModalSet|null = null;
	let commentViewer:CommentViewer;

	function resetTargetIndex(offset = 0) {
		const index = player.getCurrentTime() / (finggerDuration / totalId);
		return clamp(Math.floor(index + offset), 0, totalId);
	}

	function onChangedPlayerState(state) {
		const { ENDED, PAUSED, PLAYING, BUFFERING } = window['YT'].PlayerState;
		if (state === BUFFERING || state === ENDED || state === PAUSED) {
			abortToFetchComments();
			abortToRenderComments();
			abortToUpdateCurrentTime();
		}
		if (state === PLAYING) {
			$commentQueue = [];
			$comments = getPastComments(Math.floor(player.getCurrentTime()));
			targetIndex = resetTargetIndex(-50);
			resetViewer();
			startToFetchComments();
			startToUpdateCurrentTime();
		}
	}

	function startToFetchComments() {
		if(!browser) {
			return;
		}
		const start = clamp(targetIndex, 0, totalId);
		const end = clamp(targetIndex + scopeRange, 0, totalId);
		if (commentIndices.length > totalId + 1) {
			return;
		}
		getCommentsByRange(start, end)
			.then(data => {
				commentMap = merge(commentMap, groupBy(data, 'ElapsedTime'));
				targetIndex = end % totalId;
				pollingTimeoutId = window.setTimeout(startToFetchComments, 1000);
			})
			.catch(console.error);
	}

	function abortToFetchComments() {
		browser && window.clearTimeout(pollingTimeoutId);
	}

	function getPastComments(second:number, maxLength = 100) {
		const comments = [];
		Object.keys(commentMap)
			.filter(t => t <= second)
			.sort((a, b) => b - a)
			.some(k => {
				comments.push(...commentMap[k].slice().reverse());
				return comments.length > maxLength;
			});
		return comments.length ? comments.reverse() : [ firstComment ];
	}

	function injectCommentsToQueue() {
		const targets = (commentMap[currentTime] || []);
		const additions = differenceBy(targets, $comments, 'Uuid');
		if (additions.length) {
			$commentQueue.push( ...additions );
		}
	}

	function startToRenderComments() {
		if(!browser) {
			return;
		}
		const render = () => {
			let item = $commentQueue.shift();
			if (item) {
				$comments.push(item);
				$comments = $comments;
				commentViewer?.addComment(item);
			}
		};
		abortToRenderComments();
		if ($commentQueue.length > 1) {
			const interval = 1000 / Math.max(1, $commentQueue.length - 1);
			renderingIntervalId = window.setInterval(render, interval);
		}
		render();
	}

	function abortToRenderComments() {
		browser && window.clearInterval(renderingIntervalId);
	}

	function startToUpdateCurrentTime() {
		if(!browser) {
			return;
		}
		abortToUpdateCurrentTime();
		updateTimeIntervalId = window.setInterval(() => {
			currentTime = Math.floor(player.getCurrentTime());
		}, 500);
	}

	function abortToUpdateCurrentTime() {
		browser && window.clearInterval(updateTimeIntervalId);
	}

	function fetchCommentDataByName(name:number) {
		commentIndices.push(name);
		return fetch(`${ baseUrl }/${ name }.json`)
			.then(res => res.json())
			.catch(_ => {
				return [];
			});
	}

	function getCommentsByRange(start:number, end:number) {
		const list = difference(range(start, end + 1), commentIndices);
		const startedAt = new Date(actualStartAt);
		const offsetTime = player?.getDuration() ? player.getDuration() - finggerDuration : 0;
		return Promise.all(list.map(fetchCommentDataByName))
			.then(compact)
			.then(payloads => mapValues(flatten(map(payloads, 'Comments')), comment => {
				if(!comment) {
					return;
				}
				const publishedAt = new Date(comment?.PublishedAt);
				comment.Message = parseTextLink(comment?.Message, true, false, true);
				comment.ElapsedTime = Math.floor(differenceInSeconds(publishedAt, startedAt) + offsetTime);
				return omit(comment, [
					'LiveStreamingService',
					'ParticipationMessage',
					'AuthorUserId',
					'ProductId',
					'PublishedAt',
				]);
			}))
			.catch(console.error);
	}

	function prefetch() {
		bundleId = distribution.bundleId ?? '';
		title = distribution.title ?? '';
		description = distribution.description ?? '';
		viewCount = distribution.viewCount ?? 0;
		broadcastId = get(distribution, 'youTube.broadcastId', '');
		finggerDuration = distribution.durationSeconds ?? 0;
		distributorUuid = distribution.distributorUuid ?? '';
		actualStartAt = distribution.actualStartAt ?? '';
		scheduledStartAt = distribution.scheduledStartAt ?? '';
		isOfficial = distribution.isOfficial ?? false;
		likeCount = distribution.likeCount ?? 0;
		channelThumb = distributor.thumbnailUrl ?? '';
		channelName = distributor.youTubeChannelTitle ?? '';
		tags = distribution.tags ?? [];

		browser && fetch(`${ baseUrl }/base.json`, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(res => totalId = get(res, 'Id'))
			.then(fetchPreStartComments)
			.catch(err => {
				if (err?.message) {
					notify('チャットの取得に失敗しました', 5000);
				}
			});
	}

	function fetchPreStartComments() {
		return getCommentsByRange(0, scopeRange)
			.then(async data => {
				commentMap = groupBy(data, 'ElapsedTime');
				targetIndex = scopeRange % totalId;
				$comments = getPastComments(0);
				resetViewer();
			})
			.catch(console.error);
	}

	async function resetViewer() {
		await tick();
		commentViewer?.setComments($comments);
		commentViewer?.resetScrollPosition();
	}

	async function onChangedVisibility() {
		if(!(document.visibilityState !== 'visible')) {
			resetViewer();
		}
	}

	$: if(commentViewer) {
		resetViewer();
	}

	$: ({ streamUuid, distribution, distributor } = data);
	$: baseUrl = `${ cdnHost }/${ streamUuid }/platform`;
	$: asMobile = ($mobile && $portrait && $medium) || ( $mobile && $landscape); //横２カラム想定（TB）
	$: asBroadPC = !$mobile && $large; //３エリア想定（PC）
	$: if (currentTime > -1) {
		injectCommentsToQueue();
		startToRenderComments();
	}
	$: if (streamUuid) {
		erase(streamUuid);
		abortToFetchComments();
		abortToRenderComments();
		abortToUpdateCurrentTime();
		currentTime = 0;
		targetIndex = 0;
		$comments = [];
		$commentQueue = [];
		commentMap = {};
		commentIndices = [];
		prefetch();
	}
	$: tabRightColumns = asBroadPC
		? [ TabComment ]
		: [ TabComment, ...tabCommonColumns ];

	onDestroy(() => {
		abortToFetchComments();
		abortToRenderComments();
		abortToUpdateCurrentTime();
	});
</script>

<svelte:window on:visibilitychange={ onChangedVisibility } />

<article
	class="flex { (asMobile || asBroadPC) ? 'flex-row' : 'flex-col' } content-start absolute inset-0 overflow-hidden">
	<div class="flex flex-col relative w-full w-auto"
		class:overflow-scroll={ asBroadPC }
		class:flex-grow={ asMobile || asBroadPC }>
		<EmbedVideoPlayer
			{ broadcastId }
			distributionUuid={ streamUuid }
			on:video-state={ ({detail}) => onChangedPlayerState(detail) }
			on:video-ready={ ({detail}) => player = detail }
		/>
		<div class="flex-1 relative">
			<DistributionNaviBar
				official={ isOfficial }
				onAir={ false }
				distributionUuid={ streamUuid }
				{ distributorUuid }
				startAt={ actualStartAt }
				{ title }
				{ viewCount }
				{ channelName }
				{ channelThumb }
				{ likeCount }
				on:report={ ({ detail }) => report?.openAsDistribution(detail) }
				on:share={ () => shareModal = true }
			/>
			{#if asBroadPC}
				<Tabs bind:value={targetTab} segmented swipe={true} class="flex-wrap">
					<div class="flex py-3 m-auto max-w-9/10 relative z-0">
						<TabNav>
							{#each tabCommonColumns as item}
								<TabNavItem value={item.value}>{ item.name }</TabNavItem>
							{/each}
						</TabNav>
					</div>
					<div class="px-4 pb-4 w-full overflow-hidden">
						<LiveFeatureContents bind:mode={targetTab} list={tabCommonColumns} {description} distributionUuid={streamUuid} {distributorUuid} { tags } />
					</div>
				</Tabs>
			{/if}
			<SocialSharingModal
				bind:active={ shareModal }
				href={ $page.url.href }
				text={ title }
			/>
		</div>
	</div>
	<div
		class="wrapper relative flex-grow {asBroadPC ? 'min-w-360px max-w-360px border-l-1':''} {asMobile ? 'min-w-375px max-w-375px border-l-1':'' } h-full border-base-dark dark:border-white border-opacity-10 dark:border-opacity-12"
		class:flex-shrink-0={ asMobile }
		class:dark={ $dark }
	>
		<Tabs shrink class="flex flex-col relative w-full" bind:value={targetTab2}>
			<div class="header">
				<TabNav class="justify-center">
					{#if tabRightColumns.length > 1 }
						<TabNav class="justify-center">
							{#each tabRightColumns as item}
								<TabNavItem value={item.value}>{ item.name }</TabNavItem>
							{/each}
						</TabNav>
					{/if}
				</TabNav>
			</div>
			<LiveFeatureContents
				bind:mode={targetTab2} list={tabRightColumns} {description} distributionUuid={streamUuid} {distributorUuid} {tags}>
				<svelte:fragment slot="comments">
					<CommentViewer
						bind:this={ commentViewer }
						sendable={ false }
						on:report={ ({ detail }) => report?.openAsComment(detail) }
					/>
				</svelte:fragment>
			</LiveFeatureContents>
		</Tabs>
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
