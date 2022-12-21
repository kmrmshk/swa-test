<script lang="ts">
	import type { PageData } from './$types';
	import find from 'lodash/find';
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import { generalNotifications, publicPageNum } from '$lib/stores/notifications';
	import NoticeArticle from '$lib/components/Notification';
	import Metatags from '$lib/components/Metatags';
	import { strTrim, toPlainText } from '$lib/functions/util';

	export let data:PageData;

	$: noticeUuid = data.noticeUuid;
	$: notification = data.notification;
	$: publishedAt = format(parseISO(notification.publishedAt ?? ''), 'yyyy/MM/dd HH:mm')

	$: returnPath = '/notifications' + ($publicPageNum > 1 ? `?p=${ $publicPageNum }` : '');
	$: if(noticeUuid) {
		updateReadingStatus(noticeUuid);
	}
	function updateReadingStatus(uuid) {
		const target = find($generalNotifications.notifications, { uuid });
		if(target) {
			target.hasBadge = false;
		}
	}
</script>

<Metatags
	useSuffix
	title={ notification.title }
	description={ strTrim(toPlainText(notification.body ?? ''), 80) }
	image={ notification.imageUrl }
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