<script lang="ts" context="module">
	let intervalId = -1;
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { sidebar } from '$lib/stores/ui';
	import { mobile } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import { DistributionsApi } from '$lib/apis';
	import { onMount, onDestroy } from 'svelte';
	import LiveLinkButton from './LiveLinkButton.svelte';
	import TermsNavi from './TermsNavi.svelte';
	import Button from '$lib/components/Button';
	import { scrollTop } from '$lib/functions/scrolling';
	import { sleep } from '$lib/functions/util';
	import type { FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetail } from '$lib/apis';
	import tooltip from '$lib/actions/tooltipTrigger';
	import { landscape as landscapeDevice } from '$lib/stores/device';

	const twitterId = 'finggerOfficial';
	const externalManualUrl = import.meta.env.url_distribution_manual;
	const scheduleRouteId = '/(framed)/schedules';
	const scheduleYoshimotoRouteId = '/(framed)/schedules/yoshimoto';

	let intervalId = -1;
	let distributions:Array<DistributionDetail> = [];
	let sidebarElement:HTMLElement;
	let asMobile = derived([mobile, smaller('sm')], ([mb, sm]) => mb || sm);
	let hidden = false;

	$: shrink = !$sidebar && !$asMobile;
	$: visible = $sidebar || !$asMobile;
	$: portrait = $asMobile && !$landscapeDevice;
	$: landscape = $asMobile && $landscapeDevice;
	$: shrinkIcon = shrink || portrait;

	$: if($asMobile || landscape){
		temporarilyHide();
	}

	async function temporarilyHide(){
		if(!$sidebar){
			hidden = true;
			await sleep(250);
			hidden = false;
		}
	}

	function hideSidebar() {
		if(!$asMobile) {
			return;
		}
		sidebar.set(0);
	}

	function onClick() {
		sidebar.set(Number(!$sidebar));
	}

	function startInterval() {
		if(!browser) {
			return;
		}
		stopInterval();
		intervalId = window.setInterval(fetchDistributions, 1000 * 60);
	}

	function stopInterval() {
		if(!browser) {
			return;
		}
		window.clearInterval(intervalId);
	}

	function fetchDistributions() {
		return DistributionsApi.getApiV1DistributionsRecommended({
			limit: 20,
			offset: 0
		})
			.then(async data => {
				if(data?.length) {
					distributions = data;
				}
			})
			.catch(console.error);
	}

	function onRefresh() {
		scrollTop(sidebarElement, {
			onComplete: () => {
				startInterval();
				fetchDistributions();
			}
		});
	}

	onMount(() => {
		fetchDistributions();
		startInterval();
	});

	onDestroy(() => {
		stopInterval();
	});
</script>

<svelte:window on:refresh={ onRefresh } />

<!-- NOTE: サイドバーの z-index はグローバルヘッダーに指定している値以下となるようにする。ヘッダー内に含まれる ログイン・コイン購入モーダルより前面にサイドバーが出てしまうため -->
<!-- FIXME: モーダルの配置先を body 直下の兄弟要素に追加できるようにする（モーダルの z-index が親に依存してしまうのを回避するため） -->
<button class="select-none focus:outline-none pointer-events-none block fixed w-full h-full inset-0 bg-black opacity-0 duration-100 transition-opacity z-4 \
        { $sidebar && $asMobile ? 'opacity-60 pointer-events-auto' : 'opacity-0 pointer-events-none' } \
        { $$props.class || '' }"
	class:visible={ $sidebar }
	on:click={onClick}>
</button>

<div
	class="fi-sidebar { $asMobile ? 'absolute top-14' : 'relative top-0' } bottom-0 z-4 box-content {$$props.class || ''}"
	class:pointer-events-none={ ! visible }
	class:visible
	class:shrink>
	<nav
	class="fi-inner absolute flex flex-col inset-0 w-full justify-between bg-white border-r-1 border-base-dark border-opacity-10 transform transition-transform dark:(bg-gray-800 border-white border-opacity-10)"
	class:visible
	class:hidden
	class:portrait
	class:landscape>
		<div class="overflow-x-hidden flex-grow justify-start overflow-y-auto">
			<ul
				bind:this={ sidebarElement }
				class="h-full"
			>
				{#each distributions as distribution}
					<li on:mouseup={hideSidebar}>
						<LiveLinkButton
							onAir="{distribution.status !== 'Completed'}"
							userUuid="{distribution.distributorUuid ?? ''}"
							uuid="{distribution.uuid ?? ''}"
							thumbnailUrl="{distribution.userThumbnailUrl ?? ''}"
							channelName="{distribution.userName ?? ''}"
							distributionTitle="{distribution.title ?? ''}"
							viewersNum="{distribution.status !== 'Completed' ? distribution.concurrentViewers : distribution.viewCount}"
							official={distribution.isOfficial}
							{shrink}
						/>
					</li>
				{/each}
			</ul>
		</div>
		<hr class="border-base-dark border-opacity-10 dark:(border-white border-opacity-10)"/>
		<div class="banners bg-white border-base-dark border-opacity-10 dark:(bg-gray-800 border-white border-opacity-10)">
			<div class="schedule relative flex justify-center items-center py-3.5 px-4 cursor-pointer"
				class:is-schedules={$page.route.id == scheduleRouteId}
				on:click={ () => {
					goto('/schedules');
					hideSidebar();
				} }>
				<i class="{shrinkIcon ? 'text-2xl' : 'text-xl'} icon fingger-calendar" class:pr-2={!shrinkIcon} />
				<span class="flex-1" class:hidden={shrinkIcon}>公式配信スケジュール</span>
			</div>
			<hr class="border-base-dark border-opacity-10 dark:(border-white border-opacity-10)"/>
			<div class="schedule relative flex justify-center items-center pt-3.5 pb-2 cursor-pointer"
				class:is-schedules={$page.route.id == scheduleYoshimotoRouteId}
				on:click={ () => {
					goto('/schedules/yoshimoto');
					hideSidebar();
				} }
				use:tooltip={{
					label: 'よしもとfingger部 配信スケジュール',
					position: 'top',
					offset: { y: 9 }
			}}>
				{#if shrinkIcon}
					<img src="/assets/images/banners/banner-yoshimoto-s.webp" alt="よしもとfingger部配信のスケジュール" width="48" height="48">
				{:else}
					<img src="/assets/images/banners/banner-yoshimoto.webp" alt="よしもとfingger部配信のスケジュール" width="208" height="105">
				{/if}
			</div>
			<hr class="border-base-dark border-opacity-10 dark:(border-white border-opacity-10)"/>
			<div class="external-banners relative flex flex-wrap items-center justify-start {shrinkIcon ? 'pl-2.5 mt-4 gap-4' : 'px-4 mt-3 gap-3'}" class:mb-4={shrink}>
				<div class="flex { shrinkIcon ? 'flex-col gap-3' : 'flex-1 gap-3' }">
					<Button
						nogutters
						rounded={shrinkIcon ? 'lg' : 'xl'}
						class="twitter { shrinkIcon ? 'w-12 h-12' : 'w-full h-11' }"
						on:click={ () => window.open(`https://twitter.com/${twitterId}`, '_blank') }
						tooltip={{
							label: `@${twitterId}`,
							position: 'top',
							offset: { y: -5 }
						}}
					>
						<img src="/assets/images/icons/icon-twitter.svg" alt="twitter" width="20" height="auto">
					</Button>
					<Button
						nogutters
						rounded={shrinkIcon ? 'lg' : 'xl'}
						class="discord { shrinkIcon ? 'w-12 h-12' : 'w-full h-11' }"
						on:click={ () => window.open(`https://discord.gg/h7kU8Hsvh3`, '_blank') }
						tooltip={{
							label: 'finggerコミュニティサーバー',
							position: 'top',
							offset: { y: -5 }
						}}
					>
						<img src="/assets/images/icons/icon-discord.svg" alt="discord" width="20" height="auto">
					</Button>
				</div>
				{#if !portrait && !landscape}
					<a href={ externalManualUrl } target="_blank" class="zendesk cursor-pointer">
						{#if shrink}
							<img src="/assets/images/banners/banner-live-manual-s.png" alt="live-manual" width="48" height="48">
						{:else}
							<img src="/assets/images/banners/banner-live-manual.png" alt="live-manual" width="208" height="50">
						{/if}
					</a>
				{/if}
			</div>
		</div>
		<footer class="mt-4 px-4 pb-4 text-xs leading-relaxed" class:hidden={shrink}>
			<TermsNavi/>
		</footer>
	</nav>
</div>

<style lang="scss">
	.fi-sidebar {
		&.visible.shrink {
			transition: width .1s;
			@apply w-17;
		}
		&.visible:not(.shrink) {
			transition: width .1s;
			@apply w-60;
		}
		&:not(.visible) {
			@apply w-60;
		}
	}

	.fi-inner {
		&.visible {
			@apply translate-x-0 duration-150;
		}
		&:not(.visible) {
			@apply -translate-x-60 duration-250;
		}
		&.portrait ,
		&.landscape {
			> .banners {
				left: calc(100% + 1px);
				@apply absolute h-full border-r;
			}
		}
		&.portrait {
			> .banners {
				@apply w-17;
			}
			&:not(.visible) {
				@apply -translate-x-77;
			}
		}
		&.landscape {
			> .banners {
				@apply w-60;
			}
			&:not(.visible) {
				@apply -translate-x-120;
			}
		}
	}

	.fi-sidebar .schedule.is-schedules {
		@apply bg-primary-light bg-opacity-12 text-primary-light font-bold;
	}
	:global(.dark) .fi-sidebar .schedule.is-schedules {
		@apply bg-primary-dark bg-opacity-20 text-primary-dark;
	}

	.schedule::before {
		content: '';
		@apply absolute top-0 bottom-0 left-0 right-0 pointer-events-none transition-colors;
	}

	.schedule:hover::before{
		@apply bg-primary-light bg-opacity-8;
	}

	.external-banners {
		:global(.twitter) {
			background-color: transparent !important;
			border: 2px solid #1D9BF0;
			&:hover {
				opacity: 0.6;
			}
		}
		:global(.discord) {
			background-color: transparent !important;
			border: 2px solid #5865F2;
			&:hover {
				opacity: 0.6;
			}
		}
		.zendesk {
			display: inline-block;
			transition: opacity 0.1s ease-out;
			&:hover {
				opacity: 0.7;
			}
		}
	}
</style>
