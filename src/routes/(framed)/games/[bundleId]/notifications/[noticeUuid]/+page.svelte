<script lang="ts">
	import { page } from '$app/stores';

	import { publicPageNum } from '$lib/stores/notifications';
	import { NoticeArticle } from '$lib/components/Notification';
	import Metatags from '$lib/components/Metatags';
	import { strTrim, toPlainText } from '$lib/functions/util';

	let notification = $page.data.notification;

	$: returnPath = './' + ($publicPageNum > 1 ? `?p=${ $publicPageNum }` : '');
</script>

<Metatags
	useSuffix
	title={ notification.title }
	description={ strTrim(toPlainText(notification.body), 400) }
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
			date={ notification.date }
			imageUrl={ notification.imageUrl }
			body={ notification.body}
		/>
	</div>
</article>