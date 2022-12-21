<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import Button from '$lib/components/Button';
	import { viewport } from '$lib/stores/device';
	import { prepared } from '$lib/stores/user';
	import { openModal } from '$lib/components/Login';
	import { sleep } from '$lib/functions/util';

	export let frameWidth = 0;
	export let frameHeight = 0;
	export let src = '';
	export let offset = 0;

	// NOTE: カスタムフレームトグルボタンの領域
	const navigationOffset = 48;
	const duration = 100;
	const dispatch = createEventDispatcher();

	let initialized = false;
	let expanded = false;
	let container = null;
	let slider = null;
	let iframe = null;
	let tooltipMessage = '';

	$: if(iframe) {
		iframe.style.width = `${ frameWidth }px`;
		iframe.style.height = `${ frameHeight }px`;
		iframe.style.marginLeft = `-${ frameWidth / 2 }px`;
	}

	$: if($viewport || offset) {
		renderFrame();
	}

	onMount(async () => {
		setTooltipMessage();
	});

	export function reset() {
		initialized = false;
		expanded = false;
	}

	export function transfer(params) {
		// FIXME: Origin have to change correct one
		iframe?.contentWindow.postMessage({ type: 'FinggerSendParams', params }, '*');
	}

	function onMessage({ data }) {
		// FIXME: v0.34.2 以降は getParam による判定をオミットする
		if (data === 'getParam') {
			dispatch('request-params');
			return;
		}
		switch(data?.type) {
			case 'FinggerRequestParams': dispatch('request-params'); break;
			case 'FinggerSendComment': dispatch('send-comment', data?.params); break;
			case 'FinggerSendParams': dispatch('send-params', data?.params); break;
		}
	}

	function setTooltipMessage() {
		tooltipMessage = expanded
			? 'タップするとゆびコンを閉じます'
			: 'タップしてゆびコンをつかおう！';
	}

	async function toggleExpandState() {
		if(!$prepared) {
			openModal();
		} else {
			expanded = !expanded;
			dispatch(expanded ? 'open' : 'close');
			if (expanded) {
				initialized = true;
				renderFrame();
			}
			else {
				slider.style.height = 0;
			}
		}
		await sleep(250);
		setTooltipMessage();
	}

	async function renderFrame() {
		await tick();
		const availHeight = container?.parentNode.clientHeight - (offset + navigationOffset);
		const ratio = frameWidth / frameHeight;
		let scale = slider.clientWidth / frameWidth;
		let height = slider.clientWidth / ratio;
		if(height > availHeight) {
			height = availHeight;
			scale = availHeight / frameHeight;
		}
		slider.style.height = `${ expanded ? height : 0 }px`;
		if(iframe) {
			iframe.style.transform = `scale(${ scale })`;
		}
	}

	async function onExpandedNavibar(){
		if(expanded){
			await sleep(500);
			renderFrame();
		}
	}

</script>

<svelte:window on:message={ onMessage } on:expanded-navibar={ onExpandedNavibar } />

<div bind:this={ container }
	in:slide={{ duration, easing: cubicOut }}
	out:slide={{ duration, easing: cubicIn }}
	class="flex flex-col w-full fi-border border-b-1 { $$props.class || '' }"
>
	<div class="flex flex-row justify-start items-center p-2 h-12 bg-white dark:bg-gray-800">
		<Button plain rounded="full" nogutters class="w-9 h-9" on:click={ toggleExpandState }>
			<i class="icon text-2xl fingger-dock-finger {expanded ? 'text-primary-light dark:text-primary-dark':''}"></i>
		</Button>
		<span class="ml-3 py-1 px-6 inline-block rounded-4px pointer-events-none opacity-80 bg-base-dark dark:bg-white bg-opacity-75 text-xs text-white dark:text-gray-900">{ tooltipMessage }</span>
	</div>
	<div
		bind:this={ slider }
		class="frame-inner relative w-full overflow-hidden transition duration-200 ease-in-out bg-white dark:bg-gray-800"
		class:expanded
	>
		{#if initialized}
			<iframe
				class="absolute top-0 left-1/2 bottom-0 w-full h-full origin-top"
				title="finggerCustomFrame"
				bind:this={ iframe }
				{ src }
			></iframe>
		{/if}
	</div>
</div>
