<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { mobile, viewport } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';

	export let broadcastId = '';
	// NOTE: 表示要素が１画面中に収まるようにする
	export let ignoreAspect = false;
	export let maxHeight = 10000;

	const origin = $page.url.origin;
	const dispatch = createEventDispatcher();
	const videoAspect = 9 / 16;
	const small = smaller('sm');

	let player;
	let wrapper;
	let isReady = false;
	let asVideoAspect = true;
	let intervalId = -1;

	$: asMobile = $mobile || $small; // DistributionNaviBar と判定をあわせる
	$: baseOffset = asMobile ? 151 : 167; // sum of offset heights (global header + distribution navi bar)
	$: if (isReady && player && broadcastId) {
		player.loadVideoById(broadcastId);
	}
	$: if ($viewport || maxHeight) {
		checkOverflowHeight();
	}

	export function getHeight() {
		return wrapper?.getBoundingClientRect().height ?? 0;
	}

	function checkOverflowHeight() {
		const currentW = wrapper?.getBoundingClientRect().width || 0;
		const needsH = currentW * videoAspect;
		const isOverflow = needsH > ($viewport.height - baseOffset);
		asVideoAspect = !ignoreAspect && !isOverflow && (maxHeight > $viewport.height);
	}

	function onPlayerReady() {
		dispatch('video-ready', player);
		isReady = true;
	}

	function onPlayerStateChanged(e) {
		dispatch('video-state', e.data);
	}

	function loadYT() {
		return new Promise(resolve => {
			if(browser) {
				intervalId = window.setInterval(() => {
					if(!!window?.YT) {
						abortYT();
						resolve(window?.YT);
					}
				}, 100);
			}
		});
	}

	function abortYT() {
		browser && window.clearInterval(intervalId);
	}

	onMount(() => {
		loadYT().then(YT => {
			YT.ready(() => {
				player = new YT.Player('yt', {
					videoId: broadcastId,
					playerVars: {
						autoplay: 1,
						cc_lang_pref: 1,
						cc_load_policy: 0,
						color: 'white',
						controls: 1,
						disablekb: 0,
						enablejsapi: 1,
						fs: 1,
						iv_load_policy: 3,
						loop: 0,
						rel: 0,
						modestbranding: 0,
						origin: origin,
						playsinline: 1,
					},
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChanged,
					},
				});
			});
		});
		checkOverflowHeight();
	});

	onDestroy(() => {
		abortYT();
		player?.destroy();
	})
</script>

<div
	bind:this={ wrapper }
	class="bg-black overflow-hidden { asVideoAspect ? 'aspect-w-16 aspect-h-9' : 'w-full'} { $$props.class || '' }"
	style="max-height:{ maxHeight }px; { asVideoAspect ? '' : `min-height: ${ Math.min($viewport.height - baseOffset, maxHeight) }px`}"
>
	<div id="yt" class="w-full h-full"></div>
</div>
