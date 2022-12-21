
<script lang="ts">
	import type { PageData } from './$types';
	import { afterNavigate, goto } from '$app/navigation';
	import { prepared } from '$lib/stores/user';
	import find from 'lodash/find';
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import { userNotifications, privatePageNum } from '$lib/stores/notifications';
	import NoticeArticle from '$lib/components/Notification';
	import Metatags from '$lib/components/Metatags';
	import { trigger } from '$lib/functions/util';

	export let data:PageData;

	let {noticeUuid, notification} = data;
	let publishedAt = format(parseISO(notification?.publishedAt ?? ''), 'yyyy/MM/dd HH:mm');

	$: returnPath = '/notifications/inbox' + ($privatePageNum > 1 ? `?p=${ $privatePageNum }` : '');

	afterNavigate(() => {
		if(noticeUuid && $prepared) {
			trigger('user-update');
			updateReadingStatus(noticeUuid);
		} else {
			goto(returnPath);
		}
	});

	function updateReadingStatus(uuid) {
		const target = find($userNotifications.notifications, { uuid });
		if(target) {
			target.hasBadge = false;
		}
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<Metatags
	useSuffix
	title={ notification.title }
/>

<article class="notifications relative h-full">
	<div class="mt-5 mb-6 mx-auto md:max-w-2xl xl:max-w-3xl">
		<a href="{ returnPath }" class="fi-text-sub inline-flex items-center mb-3 pl-4 md:(pl-0 text-xl) text-sm">
			<i class="icon fingger-arrow-left text-2xl" />
			一覧へ戻る
		</a>
		<NoticeArticle
			title={ notification.title }
			date={ publishedAt }
			imageUrl={ notification.imageUrl }
			body={ notification.body}
			/>
	</div>
</article>