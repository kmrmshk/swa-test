<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { scale, fade, fly } from 'svelte/transition';
	import { mobile } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import { append, remove } from './Container.svelte';
	import Button from '$lib/components/Button';

	export let persistent = false;
	// NOTE: Fill option affected for mobile device only
	export let fill = false;
	export let fixed = true;
	export let active = false;
	export let closeable = true;
	export let acceptable = false;
	export let cancelable = false;
	export let rounded = '2.5xl';
	export let flexJustify = 'center';
	export let flexAlign = 'center';
	export let acceptLabel = 'OK';
	export let cancelLabel = 'キャンセル';
	// NOTE: 通常、Fill両モードで共通のインナー要素に対するクラススタイル指定
	export let innerClass = '';
	// NOTE: 通常モード用のラッパー要素に対するクラススタイル指定
	export let frameClass = '';
	// NOTE: Fillモード用のラッパー要素に対するクラススタイル指定
	export let fillClass = '';
	export let fillModeHeight = 'h-full'

	export let gutterSize = 4;
	export let duration = 75;

	export let loadingAccept = false;
	export let loadingCancel = false;
	export let disableAccept = false;
	export let disableCancel = false;
	export let acceptAndClose = true;
	export let cancelAndClose = true;
	export let centeringLayout = false;

	// 画面遷移時に閉じるようにするかどうか
	export let closeWithNavigate = true;

	export const open = () => {
		active = true;
		dispatch('open');
	}
	export const close = () => {
		active = false;
		dispatch('close');
	}

	const small = smaller('sm');
	const dispatch = createEventDispatcher();
	const transfer = (el:HTMLElement) => {
		if(fixed) append(el);
		return {
			destroy() {
				if(fixed) remove(el);
			}
		}
	};

	let windowHeight = 0;

	// NOTE: デフォルトはページ遷移を検出すると閉じる
	beforeNavigate(({cancel}) => {
		if(closeWithNavigate) {
			close();
		}
		else if(active) {
			cancel();
		}
	});

	$:fillMode = ($mobile || $small) && fill;
</script>

<svelte:window bind:innerHeight={windowHeight} />

<slot name="trigger" {open} />

{#if active}
	<div use:transfer class="{fillMode ? '' : `p-${gutterSize}`} { fixed ? 'fixed' : 'absolute'} z-10 top-0 left-0 w-full h-full flex justify-{ flexJustify } items-{ flexAlign } opacity-100" tabindex="0">
		<div class="absolute bg-black bg-opacity-60 w-full h-full transition" on:click={persistent ? ()=>{} : close} transition:fade={{duration:100}}></div>
		{#if fillMode}
			<div class="w-full { fillModeHeight } relative overflow-hidden bg-white dark:bg-gray-900 z-10 {$$props.class || ''} {fillClass}" transition:fly={{duration:250, opacity:1, y:windowHeight}} >
				<div class="h-full max-h-full overflow-auto { innerClass }">
					<slot {close} {fillMode} />
				</div>
				{#if closeable}
					<Button on:click={close} plain absolute nogutters rounded="full" class="inline-flex top-1 right-1 w-12 h-12 items-center justify-center">
						<i class="icon fingger-close text-2xl" />
					</Button>
				{/if}
				{#if acceptable || cancelable}
					<div class="flex px-2 pb-2 {centeringLayout ? 'justify-center' : 'justify-end'}">
						{#if cancelable}
							<Button
								text
								disabled={disableCancel}
								loading={loadingCancel}
								class="font-bold"
								on:click={() => { dispatch('cancel'); cancelAndClose && close(); }} >
								<slot name="cancel" {close}>{ cancelLabel }</slot>
							</Button>
						{/if}
						{#if acceptable}
							<Button
								text
								disabled={disableAccept}
								loading={loadingAccept}
								class="font-bold {cancelable ? 'ml-2' : ''}"
								on:click={() => { dispatch('accept'); acceptAndClose && close(); }}>
								<slot name="accept" {close}>{ acceptLabel }</slot>
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<div class="max-w-full max-h-full { rounded ? ('rounded-' + rounded) : '' } relative overflow-y-auto bg-white dark:bg-gray-900 z-10 {$$props.class || ''} {frameClass}" transition:scale={{duration:duration}}>
				<div class="w-full max-h-full overflow-auto { innerClass }" style="max-height: calc(100vh - 72px);" >
					<slot {close} {fillMode} />
				</div>
				{#if closeable}
					<Button on:click={close} plain absolute nogutters rounded="full" class="inline-flex top-1 right-1 w-12 h-12 items-center justify-center">
						<i class="icon fingger-close text-2xl" />
					</Button>
				{/if}
				{#if acceptable || cancelable}
					<div class="flex h-13 px-2 py-2 justify-end">
						{#if cancelable}
							<Button
								text
								disabled={disableCancel}
								loading={loadingCancel}
								class="px-4 inline-flex items-center font-bold"
								on:click={() => { dispatch('cancel'); cancelAndClose && close(); }} >
								<slot name="cancel" {close}>{ cancelLabel }</slot>
							</Button>
						{/if}
						{#if acceptable}
							<Button
								text
								disabled={disableAccept}
								loading={loadingAccept}
								class="px-4 inline-flex items-center font-bold {cancelable ? 'ml-2' : ''}"
								on:click={() => { dispatch('accept'); acceptAndClose && close(); }} >
								<slot name="accept">{ acceptLabel }</slot>
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
