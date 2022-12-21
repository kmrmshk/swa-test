<script lang="ts" context="module">
	export const dummyCommentId = 'dummy';
</script>
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { uuid as selfUuid } from '$lib/stores/user';
	import { desktop } from '$lib/stores/device';
	import { larger } from '$lib/stores/breakpoint';
	import pressCursor from '$lib/actions/pressCursor';
	import Button from '$lib/components/Button';
	import Avatar from '$lib/components/Avatar';
	import { getThumbnailById } from '$lib/stores/gifts';

	export let name = '';
	export let message = '';
	export let uuid = '';
	export let usedItem = false;
	export let thumbnail = '';
	export let error = '';
	export let superChat = null;
	export let membership = null;
	export let gift = null;

	const dispatch = createEventDispatcher();
	const errorImage = '/assets/images/icons/thumb-user-default.png';
	const large = larger('md');

	let commentType = '';

	$: asBroadPC = $desktop && $large;
	$: displayString = superChat?.AmountDisplayString || membership?.MainLabelDisplayString || gift?.Price || '';
	$: subLabel = membership?.SubLabelDisplayString || '';
	$: tier = superChat?.Tier || gift?.Tier || 0;
	$: reportable = uuid !== dummyCommentId && uuid !== $selfUuid;
	$: paid = tier > 0;
	$: isMembership = membership !== null;
	$: isGift = gift !== null;
	$: switch(true) {
		case tier     >=  7       : commentType = 'red'; break;
		case tier     === 6       : commentType = 'magenta'; break;
		case tier     === 5       : commentType = 'orange'; break;
		case tier     === 4       : commentType = 'yellow'; break;
		case tier     === 3       : commentType = 'green'; break;
		case tier     === 2       : commentType = 'cyan'; break;
		case tier     === 1       : commentType = 'blue'; break;
		case usedItem === true    : commentType = 'purple'; break;
		case isMembership === true: commentType = 'membership'; break;
		default                   : commentType = 'none';
	}

	function onClickedAsMore(e) {
		dispatch('more', e);
	}
</script>
<!-- NOTE: ダミーコメント、自身のコメントをのぞきhover時の効果をつける -->
<div class="comment-wrapper px-6 md:px-4 py-1.5" use:pressCursor class:effect={ !asBroadPC && reportable } class:normal={ !paid && !usedItem && !error }>
	{#if isGift }
		<div class="gift inner rounded-lg overflow-hidden shadow-02dp flex flex-row" on:click>
			<div class="flex-grow comment message-{commentType} pt-3 pl-4 pr-3">
				<div class="flex relative h-44px">
					<Avatar class="rounded-14px" thumbnail={ thumbnail } altImage={ errorImage } size="32" />
					<div class="ml-3 flex-1">
							<h6 class="body-1 line-clamp-1 mb-1 pr-3 comment message-{commentType} text-xs leading-3">{name}</h6>
							<div class="inline-flex focus:outline-none items-center justify-start">
								<img class="mr-1" src="/assets/images/icons/coin.svg" width="16" height="16" alt="coin"/>
								<span class="inline-block text-sm font-light leading-4">{displayString}</span>
							</div>
					</div>
					<!-- NOTE: ダミーコメント、自身のコメントをのぞき報告できるようにする -->
					{#if asBroadPC && reportable}
						<div class="absolute -top-1.5 -right-4">
							<Button on:click={ onClickedAsMore } text nogutters class="report-button w-10 h-10 rounded-3xl">
								<i class="icon fingger-more text-2xl transform rotate-90 comment header-{commentType} bg-transparent"></i>
							</Button>
						</div>
					{/if}
				</div>
				<p class="body-3 line-clamp-3 comment message-{commentType} text-sm leading-tight">
					{@html message}
				</p>
			</div>
			<div class="flex-grow-0 comment header-{commentType} p-3">
				<div class="w-94px h-94px flex-shrink-0 bg-contain bg-center"
					style="{`background-image: url(${getThumbnailById(gift?.GiftId ?? '')});`}"></div>
			</div>
		</div>
	{:else if paid || isMembership }
		<div class="inner rounded-lg overflow-hidden shadow-02dp" on:click>
			<div class="comment header-{commentType} flex px-4 py-3">
					<Avatar class="rounded-14px" thumbnail={ thumbnail } altImage={ errorImage } size="32" />
					<div class="ml-3 flex-1">
						<h6 class="fi-lb comment header-{commentType} text-xs">{name}</h6>
						<span class="comment header-{commentType} text-sm font-bold">{displayString}</span>
						{#if subLabel.length}
							<div class="text-xs opacity-75">{subLabel}</div>
						{/if}
					</div>
					<!-- NOTE: ダミーコメント、自身のコメントをのぞき報告できるようにする -->
					{#if asBroadPC && reportable}
						<Button on:click={ onClickedAsMore } text nogutters class="report-button -right-4 w-10 h-10 rounded-3xl">
							<i class="icon fingger-more text-2xl transform rotate-90 comment header-{commentType} bg-transparent"></i>
						</Button>
					{/if}
			</div>
			{#if message.length}
				<p class="fi-lb comment message-{commentType} px-4 py-3 text-sm">
					{@html message}
				</p>
			{/if}
		</div>
	{:else if usedItem}
		<div class="inner rounded-lg comment header-{commentType} flex items-center px-4 py-3 shadow-02dp" on:click>
			<Avatar class="rounded-14px" thumbnail={ thumbnail } altImage={ errorImage } size="32" />
			<div class="ml-3 flex-1">
				<h6 class="fi-lb comment header-{commentType} text-xs">{name}</h6>
				<div class="fi-lb comment header-{commentType} text-sm font-bold fi-ffs-palt">{@html message}</div>
			</div>
			<!-- NOTE: ダミーコメント、自身のコメントをのぞき報告できるようにする -->
			{#if asBroadPC && reportable}
				<Button text nogutters class="report-button -right-4 w-10 h-10 rounded-3xl" on:click={ onClickedAsMore }>
					<i class="icon fingger-more text-2xl transform rotate-90 comment header-{commentType} bg-transparent"></i>
				</Button>
			{/if}
		</div>
	{:else if error}
		<div class="inner flex flex-row">
			<Avatar class="mt-1 flex-shrink-0 opacity-40 rounded-14px" thumbnail={ thumbnail } altImage={ errorImage } size="24" />
			<div class="pl-2 flex-1 opacity-60">
				<h6 class="fi-text-sub text-xs">{name}</h6>
				<p class="fi-lb text-sm">
					{error}
				</p>
			</div>
		</div>
	{:else}
		<div class="inner flex flex-row" on:click>
			<Avatar class="mt-1 flex-shrink-0 rounded-14px" thumbnail={ thumbnail } altImage={ errorImage } size="24" />
			<div class="pl-2 flex-1">
				<h6 class="fi-text-sub text-xs">{name}</h6>
				<p class="fi-lb text-sm">
					{@html message}
				</p>
			</div>
			<!-- NOTE: ダミーコメント、自身のコメントをのぞき報告できるようにする -->
			{#if asBroadPC && reportable}
				<Button on:click={ onClickedAsMore } text nogutters class="report-button -right-3 w-8 h-8">
					<i class="icon fingger-more text-2xl transform rotate-90 text-base-dark dark:text-white text-opacity-87"></i>
				</Button>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.comment {
		&.header-red     { background-color: #BF271B; color: white; }
		&.header-magenta { background-color: #B22E5B; color: white; }
		&.header-orange  { background-color: #D65A26; color: white; }
		&.header-yellow  { background-color: #F5B53F; @apply text-base-dark; }
		&.header-green   { background-color: #55BCA6; @apply text-base-dark; }
		&.header-cyan    { background-color: #50B5D0; @apply text-base-dark; }
		&.header-blue    { background-color: #2C64B8; color: white; }
		&.header-purple  { background-color: #772CB8; color: white; }
		&.header-membership  { background-color: #2F6F3C; color: white; }

		&.message-red     { background-color: #D33929; color: white; }
		&.message-magenta { background-color: #CC365F; color: white; }
		&.message-orange  { background-color: #E68231; color: white; }
		&.message-yellow  { background-color: #F8CA4F; @apply text-base-dark; }
		&.message-green   { background-color: #68DBB1; @apply text-base-dark; }
		&.message-cyan    { background-color: #65DFF8; @apply text-base-dark; }
		&.message-blue    { background-color: #2C64B8; color: white; }
		&.message-purple  { background-color: #772CB8; color: white; }
		&.message-membership  { background-color: #3D8F52; color: white; }

		&.bg-transparent {  background-color: transparent; }
	}
	// 200円未満のギフトコメントの場合は、スパチャとは異なりメッセージ用の背景色の指定が入ります
	.gift .comment.message-blue { background-color: #347fe1; }

	.normal.effect:hover,
	.normal.effect.press {
		@apply cursor-pointer bg-base-dark bg-opacity-4 transition duration-250 delay-100;
	}

	:global(.dark) .normal.effect:hover,
	:global(.dark) .normal.effect.press {
		@apply bg-white bg-opacity-8;
	}

	:not(.normal).effect .inner:hover,
	:not(.normal).effect .inner.press {
		@apply cursor-pointer transition transform scale-101 delay-100;
	}

	.comment-wrapper :global(.report-button){
		opacity: 0;
	}
	.comment-wrapper:hover :global(.report-button){
		opacity: 1;
	}
</style>