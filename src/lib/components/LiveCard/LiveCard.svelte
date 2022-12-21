<script lang="ts" context="module">
	let playingUuid = '';
	export function isPlaying(){
		return playingUuid !== '';
	}
</script>
<script lang="ts">
	import { browser } from '$app/environment';
	import format from 'date-fns/format/index.js';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { dark } from '$lib/stores/theme';
	import { viewport, phone } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import Player from '@vime/svelte/src/svelte/Player.svelte?client';
	import Youtube from '@vime/svelte/src/svelte/Youtube.svelte?client';
	import Ui from '@vime/svelte/src/svelte/Ui.svelte?client';
	import Controls from '@vime/svelte/src/svelte/Controls.svelte?client';
	import ScrubberControl from '@vime/svelte/src/svelte/ScrubberControl.svelte?client';
	import intersectElement from '$lib/actions/intersectElement';
	import { toApproxNumber, encodeURI } from '$lib/functions/util';
	import { LiveCardBase } from '$lib/components/LiveCard';

	const small = smaller('xs'); // grid-cols-1になる条件とあわせる

	export let title = '';
	export let thumbnailUrl = '';
	export let userName = '';
	export let userThumbnailUrl = '';
	export let viewersNum = 0;
	export let streamUuid = '';
	export let distributorUuid = '';
	export let startAt = null;
	export let onAir = false;
	export let official = false;
	export let broadcastId = '';
	export let duration = 0;
	export let sort = 'popular';
	export let tags = [];
	export let selectedTags = [];

	let timeoutId = -1;
	let player;
	let playing = false;
	let intersecting = false;
	let hovering = false;
	let waiting = false;
	let initializedPlayer = false;
	let intersectOptions = {};

	$: asPortrait = $phone && $small;
	$: if( broadcastId.length && asPortrait ){
			if(intersecting){
				setTimer(500);
			}
			else{
				stopVideo();
			}
		}

	$: if( browser && asPortrait ){
			const rootMarginTop = -120;
			const rootMarginBottom = ($viewport.height + rootMarginTop - 280 ) * -1 ;
			intersectOptions = {rootMargin: `${rootMarginTop}px 0px ${rootMarginBottom}px 0px`};
		}
		else{
			intersectOptions = {};
			if( hovering && intersecting && ! waiting ){
				setTimer(300);
			}
			else {
				stopVideo();
			}
		}

	const assetBase = `${ import.meta.env.asset_endpoint }`;

	function onClickedCard() {
		if (onAir) {
			goto(`/streams/${ streamUuid }`)
		}
		else {
			goto(`/archives/${ streamUuid }`)
		}
	}

	function clearTimer(){
		browser && clearTimeout(timeoutId);
		waiting = false;
	}

	function setTimer(ms) {
		if( broadcastId.length ){
			clearTimer();
			playingUuid = streamUuid;
			timeoutId = browser && window.setTimeout(() => {
				playVideo();
			}, ms) || -1;
		}
	}

	function playVideo() {
		initializedPlayer = false;
		playing = true;
		playingUuid = streamUuid;
	}

	function stopVideo() {
		playing = false;
		clearTimer();
		if( playingUuid === streamUuid ){
			playingUuid = '';
		}
		browser && document.removeEventListener("visibilitychange", onVisibilitychange);
	}

	function onReady() {
		const shadow = player.ref().shadowRoot;
		const childNodes = Array.from(shadow.childNodes);
		childNodes.forEach(childNode => {
			if (childNode['s-hn'] === 'VM-PLAYER') {
				// NOTE: min-width:275px:を打ち消す
				childNode.style.minWidth = '0px';
			}
		});
		browser && document.addEventListener("visibilitychange", onVisibilitychange);
	}

	function onPlaying() {
		initializedPlayer = true;
	}

	function onVisibilitychange() {
		if(document.visibilityState === 'visible'){
			player.play();
		}
		else{
			player.pause();
		}
	}

	function onEnded() {
		stopVideo();
		waiting = true;
		timeoutId = window.setTimeout(()=>{
			waiting = false;
		}, 1000);
	}

	function onClickedTag(e){
		const tag = e.detail;
		const maxTagLength = 2;
		let tagNames = selectedTags.map( sTag => sTag.name );
		const index = selectedTags.findIndex( sTag => sTag.id == tag.id );
		if( -1 < index ){
			tagNames.splice( index, 1 );
		}
		else{
			tagNames.push( tag.name );
		}
		if( maxTagLength < tagNames.length ){
			tagNames.splice( maxTagLength - 1, 1 );
		}
		const path = tagNames.map( name => encodeURI(name) ).join('/');
		goto( tagNames.length ? `/tags/${path}?s=${sort}`:`/?s=${sort}`);
	}

	onDestroy(() => {
		clearTimer();
		browser && document.removeEventListener("visibilitychange", onVisibilitychange);
	});

</script>

<LiveCardBase
	class="cursor-pointer"
	on:click={onClickedCard}
	on:mouseenter={ () => hovering = true }
	on:mouseleave={ () => hovering = false }
	on:click-distributor={ () => goto(`/users/${distributorUuid}`) }
	on:click-tag={ onClickedTag }
	{title}
	{thumbnailUrl}
	{userName}
	{userThumbnailUrl}
	{onAir}
	{official}
	{distributorUuid}
	{duration}
	{tags}
	{selectedTags}
	playable={ !! broadcastId.length}
	playing={ playing && initializedPlayer }
	>
	<svelte:fragment slot="player">
		{#if $viewport.height}
		<div class="absolute w-1 h-1 top-0 left-0 z-1"
			use:intersectElement={ intersectOptions }
			on:update={ (e) => intersecting = e.detail }
		/>
		{/if}
		{#if broadcastId.length && playing }
			<Player
				bind:this={player}
				on:vmReady={onReady}
				on:vmCurrentTimeChange|once={onPlaying}
				on:vmPlaybackEnded={onEnded}
				muted
				paused={false}
				playsinline
				style={ initializedPlayer ? "":"margin:1px" }
				>
				<!-- margin:1px : 初期化前にPlayer左上部分が描画されていないと初期化が始まらないので、描画座標をずらす -->
				<Youtube videoId={broadcastId} />
				{#if ! onAir}
					<Ui>
						<Controls>
							<div on:click={ e => e.stopPropagation() } class="flex w-full h-full py-3 -mb-3">
								<ScrubberControl />
							</div>
						</Controls>
					</Ui>
				{/if}
			</Player>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<div class="inline-flex items-center justify-self-start pl-1">
			{#if startAt}
				<i class="icon fingger-clock-framed"/>
				<span class="pl-1 fi-text text-sm">{ format(new Date(startAt), 'MM/dd HH:mm') }</span>
			{/if}
		</div>
		<div class="fi-text flex items-center justify-self-end pr-1">
			<!-- いいね数 -->
			<!--
			{#if likeCount}
				{#if true}
					<i class="text-xl text-base-dark dark:text-base-light leading-none icon fingger-thumbs-up-outline"></i>
				{:else}
					<i class="text-xl text-base-dark dark:text-base-light leading-none icon fingger-thumbs-up"></i>
				{/if}
				<span class="ml-2 text-sm">{ toApproxNumber(likeCount) }</span>
			{/if}
			-->
			<!-- 視聴数・再生数 -->
			{#if onAir}
				<img class="ml-3 mr-2" src="/assets/images/icons/icon-live{$dark ? '@dark' : ''}.svg" alt="live" width="20" height="auto"/>
			{:else}
				<i class="ml-3 text-xl font-light icon fingger-eye mr-1"></i>
			{/if}
			<span class="text-sm mr-2">{ toApproxNumber(viewersNum) }</span>
		</div>
	</svelte:fragment>
</LiveCardBase>
