<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, tick } from 'svelte';
	import { linear } from 'svelte/easing';
	import debounce from 'lodash/debounce';
	import { prepared, uuid, thumbnailUrl, channel } from '$lib/stores/user';
	import { desktop } from '$lib/stores/device';
	import { larger } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import { commentTips } from '$lib/stores/ui';
	import { DistributionsApi } from '$lib/apis';
	import { scrollBottom } from '$lib/functions/scrolling';

	import VirtualList from '$lib/components/VirtualList';
	import TextField from '$lib/components/TextField';
	import Button from '$lib/components/Button';
	import Menu, { MenuItem } from '$lib/components/Menu';
	import Tooltip from '$lib/components/Tooltip';
	import Modal from '$lib/components/Modal';
	import { strLength, parseTextLink } from '$lib/functions/util';

	import CommentItem, { dummyCommentId } from './CommentItem.svelte';
	import { openModal } from '$lib/components/Login';
	import Loading from '$lib/components/Loading';
	import colors from '$lib/styles/colors';

	export let streamUuid = '';
	export let sendable = true;
	export let inputable = true;

	const dispatch = createEventDispatcher();
	const maxlength = 200;
	const large = larger('md');

	let virtualList = null;
	let comments = [];
	let wrapper = null;
	let menu = null;
	let inputComment = '';
	let hashMode = false;
	let isTooltip = false;
	let selectedReportIndex = -1;
	let modal = false;
	let abortController = null;
	let shouldAutoScroll = true;
	let processing = true;

	$: asBroadPC = $desktop && $large;
	$: errorText = strLength(inputComment) > maxlength ? '入力文字数が多すぎます。'
				: inputComment.match(/^\s+$/) ? 'スペースのみでは送信できません。'
				: '';

	$: if(streamUuid) {
		inputComment = '';
	}

	$: if(browser && isTooltip) {
		window.setTimeout(() => {
			$commentTips = false;
			isTooltip = false;
		}, 5000);
	}

	export async function resetScrollPosition(recursive = false, duration = 300) {
		const element = virtualList?.getViewport();
		if(abortController) {
			abortController.abort();
			abortController = null;
		}
		if(element) {
			if(!recursive) {
				element.scrollTop = 0;
			}
			processing = true;
			await tick();
			abortController = scrollBottom(element, {
				duration: duration,
				easing: linear,
				onComplete: () => {
					if(Math.round(element.scrollTop + element.clientHeight + 1) >= element.scrollHeight) {
						processing = false;
						shouldAutoScroll = true;
					} else {
						resetScrollPosition(true, duration / 2);
					}
				}
			});
		}
	}

	export async function setComments(commentList) {
		comments = [...commentList];
	}

	export function addComment(comment, convertingUrl = false) {
		comment.MessagePlane = comment.Message;
		if(convertingUrl){
			comment.Message = parseTextLink( comment.Message, true, false, true);
		}
		comments.push(comment);
		comments = comments;
	}

	export function addCommentByString(comment) {
		const data = {
			Uuid: `${ Date.now() }_${ Math.random() * 100000000 >> 0 }`,
			AuthorDisplayName: $channel.title,
			Message: comment,
			Price: 0,
			Item: null,
			UserUuid: $uuid,
			UserThumbnail: $thumbnailUrl,
			SuperChatDetails: null,
			MembershipChatDetail: null,
			// NOTE: error property is used only sending comment
			error: ''
		};
		addComment(data, true);
		return data;
	}

	function onClickedCommentSendButton() {
		if(!$prepared) {
			openModal();
			return;
		}
		sendCommentDebounce(inputComment);
		inputComment = '';
	}

	function onKeypressCommentInput(e) {
		if(!$prepared && e.charCode === 13) {
			openModal();
			return;
		}
		if (inputComment.length && !errorText.length && e.charCode === 13) {
			sendCommentDebounce(inputComment);
			// NOTE: コメント送信のステータス関係なくコメントリセットし重複送信防止
			inputComment = '';
		}
	}

	function onScroll(e) {
		const { scrollTop, clientHeight, scrollHeight } = e.detail.target;
		const ratio = (scrollHeight - (scrollTop + clientHeight)) / scrollHeight * 100;
		if(!processing && ratio > 1) {
			shouldAutoScroll = false;
		}
		menu?.close();
	}

	function onWheelViewer(e) {
		if(!processing && e.deltaY < 0) {
			shouldAutoScroll = false;
		}
		menu?.close();
	}

	function onActiveAutoScroll() {
		if(processing) {
			return;
		}
		resetScrollPosition();
	}

	function onClickedAndDispatchEvent() {
		dispatch('report', comments[selectedReportIndex].Uuid);
		modal = false;
		menu?.close();
	}

	function onClickedCommentItem(index) {
		selectedReportIndex = index;
		modal = true;
	}

	function onClickedMoreIcon(e, index) {
		const parent = wrapper.getBoundingClientRect();
		const target = e.target.getBoundingClientRect();
		shouldAutoScroll = false;
		menu.open(48, target.top - parent.top);
		selectedReportIndex = index;
	}

	const sendCommentDebounce = debounce(sendComment, 250, {
		leading: true,
		trailing: false
	});

	export function sendComment(comment, ignoreHash:boolean = false) {
		if (!comment.length) {
			return;
		}
		const commentData = addCommentByString((hashMode && !ignoreHash) ? '#'+comment : comment);
		DistributionsApi
			.postApiV1DistributionsComments({
				uuid: streamUuid,
				text: commentData.MessagePlane
			})
			.then(data => {
				if(!data) {
					commentData.error = 'コメント送信に失敗しました。';
					comments = comments;
				}
			})
			.catch((e) => {
				console.warn(e);
				commentData.error = 'コメント送信に失敗しました。';
				comments = comments;
			});
	}

	function onClickedHashButton(){
		hashMode = !hashMode;
	}
</script>

<div class="comment-viewer relative flex-grow">
	<div
		bind:this={ wrapper }
		class="absolute top-0 bottom-0 w-full h-full"
		class:processing={ processing }
	>
		{#if asBroadPC}
			<Menu
				bind:this={ menu }
				offsetX
				offsetY
				absolute
				disabled
				right
				wrapperClass="absolute inset-0"
			>
				<MenuItem navi lg class="pl-6 pr-4" on:click={ onClickedAndDispatchEvent }>
					<i slot="icon" class="icon fingger-flag"></i>
					報告する
				</MenuItem>
				<!-- <MenuItem class="pl-6 pr-4">
					<i slot="icon" class="icon fingger-share"></i>
					共有
				</MenuItem> -->
			</Menu>
		{:else}
			<!-- SPレイアウト向けのコメントメニュー -->
			<Modal
				rounded="xl"
				bind:active={ modal }
				closeable={false}
				class="py-3 px-1 shadow-06dp"
			>
				<MenuItem on:click={ onClickedAndDispatchEvent } navi lg class="pl-6 pr-4">
					<i slot="icon" class="icon fingger-flag"></i>
					報告する
				</MenuItem>
				<!-- <MenuItem class="pl-6 pr-4">
					<i slot="icon" class="icon fingger-share"></i>
					共有
				</MenuItem> -->
			</Modal>
		{/if}
		<VirtualList
			bind:this={ virtualList }
			let:item
			let:index
			items={ comments }
			autoScroll={ shouldAutoScroll }
			on:mousewheel={ onWheelViewer }
			on:scroll={ onScroll }
			on:scrollBottom={ () => shouldAutoScroll = true }
		>
			<CommentItem
				name={ item.AuthorDisplayName }
				message={ item.Message }
				usedItem={ !!(item.Item && item.Item.Uuid) }
				uuid={ item.UserUuid }
				thumbnail={ item.UserThumbnail }
				superChat={ item.SuperChatDetails || null }
				membership={ item.MembershipChatDetails || null }
				gift={ item.Gift || null }
				error={ item.error || '' }
				on:click={ () => (!asBroadPC && item.UserUuid !== dummyCommentId && item.UserUuid !== $uuid) && onClickedCommentItem(index) }
				on:more={ e => onClickedMoreIcon(e.detail, index) }
			/>
		</VirtualList>
	</div>
	{#if processing}
		<div class="inline-flex justify-center items-center absolute inset-0 overflow-hidden pointer-events-none">
			<Loading light={colors.primary.light} dark={colors.primary.dark} size="32" />
		</div>
	{/if}
	{#if !shouldAutoScroll && !processing}
		<Button
			absolute
			nogutters
			class="w-8 h-8 bottom-2 left-1/2 -ml-5 rounded-full"
			on:click={ onActiveAutoScroll }
		>
			<i class="text-2xl icon fingger-arrow-down"></i>
		</Button>
	{/if}
</div>

<!-- NOTE: CustomFrame -->
<slot/>

{#if sendable}
	<div class="relative w-full flex flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-800" class:pb-6={!!errorText}>
		<Button plain rounded="full" nogutters class="px-2 py-2 -ml-2" on:click={onClickedHashButton}>
			<i class="icon text-2xl {hashMode ? 'fingger-comment-hashed text-primary-light dark:text-primary-dark':'fingger-comment'}"></i>
		</Button>
		{#if $commentTips}
			<Tooltip bind:active={ isTooltip } class="absolute" x={-80} y={-20} label={ 'アイコン押下でモード切替できます' } />
		{/if}
		<TextField
			block
			fill
			class="flex-grow fi-text"
			placeholder={hashMode ? "ハッシュタグコメント入力":"コメントを入力"}
			inputClass={hashMode ? ($dark ? 'text-primary-dark' : 'text-teal-700') : ''}
			disabled={ !inputable }
			error={ errorText.length }
			errorText= { errorText }
			maxlength={ maxlength +1 }
			on:focus={() => isTooltip = true}
			on:keypress={ onKeypressCommentInput }
			bind:value={ inputComment }/>
		<Button class="ml-2 px-0 md:px-0 min-w-16" nogutters disabled={ !inputable || !inputComment.length || errorText.length }
			on:click={ onClickedCommentSendButton }>送る</Button>
	</div>
{/if}

<style lang="scss">
	.comment-viewer .processing {
		pointer-events: none;
		opacity: 0;
	}
</style>
