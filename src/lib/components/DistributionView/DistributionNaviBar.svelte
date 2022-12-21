<script lang="ts">
	import { goto, beforeNavigate } from '$app/navigation';
	import format from 'date-fns/format/index.js';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { uuid } from '$lib/stores/user';
	import { mobile } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import Avatar from '$lib/components/Avatar';
	import Menu, { MenuItem } from '$lib/components/Menu';
	import Modal from '$lib/components/Modal';
	import Button from '$lib/components/Button';
	import { toApproxNumber, trigger } from '$lib/functions/util';

	export let distributionUuid = '';
	export let distributorUuid = '';
	export let title = '';
	export let viewCount = 0;
	export let channelName = '';
	export let channelThumb = '';
	export let onAir = false;
	export let startAt = '';
	export let official = false;
	export let isGiftEnable = false;
	export let isGiftEffectEnable = false;
	export let likeCount = 0;

	const dispatch = createEventDispatcher();
	const small = smaller('sm');

	let menu = false;

	$: asMobile = $mobile || $small;
	$: navibar = !asMobile;

	function onClickedReport() {
		dispatch('report', distributionUuid);
		menu = false;
	}

	async function onClickedOpenButton(){
		navibar = !navibar;
		trigger('expanded-navibar');
	}

	function onClickedDistributorName() {
		goto(`/users/${ distributorUuid }`);
	}

	beforeNavigate(({ from, to }) => {
		if( from?.route.id != to?.route.id ){
			navibar = false;
		}
	});
</script>

<div
	class="fi-border relative flex items-center w-full bg-white dark:bg-gray-800 border-b-1 { asMobile ? 'pl-4 pr-2 h-12':'pl-8 pr-4 h-16'}">
	<Avatar on:click={ onClickedDistributorName }
		class="{ asMobile ? 'rounded-14px' : 'rounded-20px' } cursor-pointer"
		style="{ official ? 'box-shadow: 0 0 0 3px #06A3B4;' : ''}"
		thumbnail="{ channelThumb }" size={ asMobile ? 32 : 48}/>
	<div class="flex flex-col items-start content-center justify-center ml-2 pb-0 flex-1 overflow-hidden">
		<h4 class="fi-lb text-sm font-bold line-clamp-1 leading-normal"
			title={ title }>{ title }</h4>
		<h5 class="fi-text-sub fi-anchor mr-1 items-center line-clamp-1 font-light cursor-pointer h-1rem { asMobile ? 'text-xs leading-tight' : 'text-sm leading-relaxed' }"
			title={ channelName }
			on:click={ onClickedDistributorName }>{ channelName }
		</h5>
	</div>
	{#if asMobile}
		<!-- 開閉ボタン -->
		<Button plain nogutters rounded="full" class="px-2 py-2" on:click={ onClickedOpenButton }>
			<i class="text-2xl font-light icon {navibar ? 'fingger-arrow-down':'fingger-arrow-up'}"></i>
		</Button>
	{/if}
</div>
{#if navibar}
	<div transition:slide={{ duration: 100 }} class="fi-border flex flex-row justify-start items-center w-full bg-white dark:bg-gray-800 relative z-1 h-12 border-b-1 { asMobile ? 'pl-4 pr-2':'pl-8 pr-4'}">
		<div class="table fi-text flex-nowrap items-center mr-2">
			<div class="table-row">
				{#if likeCount}
					<i class="table-cell align-middle text-xl text-base-dark dark:text-base-light leading-none icon fingger-thumbs-up-outline"></i>
					<div class="table-cell align-middle pl-2 pr-3 leading-none">
						<span class="inline-block text-xs md:text-sm">{ toApproxNumber(likeCount) }</span>
					</div>
				{/if}
				{#if onAir}
					<div class="table-cell align-middle min-w-20px">
						<img class="mr-1" src="/assets/images/icons/icon-live{$dark ? '@dark' : ''}.svg" alt="live"
							width="20" height="auto" />
					</div>
				{:else}
					<i class="table-cell align-middle font-light icon fingger-eye { asMobile ? 'text-lg' : 'text-xl' }"></i>
				{/if}
				<div class="table-cell align-middle pl-1 pr-3 leading-none">
					<span class="inline-block { asMobile ? 'text-xs' : 'text-sm' }">{ viewCount }</span>
				</div>
				{#if onAir}
					<i class="table-cell align-middle font-light icon { asMobile ? 'text-lg' : 'text-xl' }"
						class:fingger-gift={ isGiftEnable }
						class:fingger-gift-invalid={ !isGiftEnable }
						class:gift-on={ isGiftEnable && isGiftEffectEnable }
						class:gift-effect-off={ isGiftEnable && !isGiftEffectEnable }
						class:gift-off={ !isGiftEnable }
					></i>
					<div class="table-cell align-middle pl-1 pr-2 leading-none">
						<span class="inline-block text-xs"
							class:gift-on={ isGiftEnable && isGiftEffectEnable }
							class:gift-effect-off={ isGiftEnable && !isGiftEffectEnable }
							class:gift-off={ !isGiftEnable }
						>{isGiftEnable ? (isGiftEffectEnable ? 'ON' : '演出OFF') :'OFF'}</span>
					</div>
				{/if}
				{#if !onAir && startAt }
					<i class="table-cell align-middle font-light icon fingger-clock { asMobile ? 'text-lg' : 'text-xl' }"></i>
					<div class="table-cell align-middle pl-1 pr-2 leading-none">
						<span class="whitespace-nowrap { asMobile ? 'text-xs' : 'text-sm' }">{ format(new Date(startAt), 'MM/dd HH:mm') }</span>
					</div>
				{/if}
				<div class="table-cell align-middle">
					<Button nogutters plain rounded="md" on:click={() => dispatch('share')}>
						<div class="flex gap-1 px-1 py-1 pr-2 items-end">
							<i class="icon fingger-arrow-rise-right text-xl text-base-dark text-opacity-87 dark:text-white"></i>
							<span class="text-xs font-normal text-base-dark text-opacity-87 dark:text-white">共有</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
		<div class="flex-grow flex justify-end">
			{#if asMobile }
				<Button plain rounded="full" nogutters class="px-2 py-2" on:click={ () => menu = true }>
					<i class="text-2xl font-light icon fingger-more"></i>
				</Button>
			{:else}
				<Menu right bind:active={ menu }>
					<div slot="trigger">
						<Button plain rounded="full" nogutters class="px-2 py-2">
							<i class="text-2xl font-light icon fingger-more"></i>
						</Button>
					</div>
					<MenuItem disabled={ $uuid === distributorUuid } on:click={ onClickedReport } navi lg class="pl-6 pr-4">
						<i slot="icon" class="icon fingger-flag"></i>
						報告する
					</MenuItem>
					<!-- <MenuItem class="pl-6 pr-4">
						<i slot="icon" class="icon fingger-share"></i>
						共有
					</MenuItem> -->
				</Menu>
			{/if}
		</div>
	</div>
{/if}
<!-- サブメニュー -->
{#if asMobile }
	<Modal rounded="xl" bind:active={ menu } closeable={false} class="py-3 px-1 shadow-06dp">
		<MenuItem disabled={ $uuid === distributorUuid } on:click={ onClickedReport } navi lg class="pl-6 pr-4">
			<i slot="icon" class="icon fingger-flag"></i>
			報告する
		</MenuItem>
		<!-- <MenuItem class="pl-6 pr-4">
			<i slot="icon" class="icon fingger-share"></i>
			共有
		</MenuItem> -->
	</Modal>
{/if}

<style>
	.gift-on {
		@apply text-primary-light;
	}
	:global(.dark) .gift-on {
		@apply text-primary-dark;
	}
	.gift-effect-off {
		@apply text-error-dark;
	}
	:global(.dark) .gift-effect-off {
		@apply text-error-light;
	}
	.gift-off {
		@apply opacity-40;
	}
</style>
