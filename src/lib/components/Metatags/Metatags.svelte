<script lang="ts">
	import { page } from '$app/stores';

	const defaultName = 'fingger（フィンガー）';
	const defaultDescription = 'fingger（フィンガー）は、ライブ配信に視聴者がコメントやアイテムで参加できるYouTube ライブで遊べる参加型ゲームプラットフォームです。あなたがいなければ始まらない！あなたのコメントがゲームを作る！配信者と一緒に遊べるプラットフォームfinggerに今すぐ参加しよう！';
	const defaultType = 'website';
	const defaultLocale = 'ja_JP';
	const twitterAccount = 'finggerOfficial';

	export let useSuffix = false;
	export let useDescriptionSuffix = false;

	export let title = defaultName;
	export let description = defaultDescription;
	export let image = '';
	export let alt = '';
	export let width = 480;
	export let height = 360;
	export let card = 'summary_large_image';

	$: pageTitle = useSuffix ? `${ title } | ${ defaultName }` : title;
	$: pageDescription = `${ description.replace(/\r?\n/g, '') }${ useDescriptionSuffix ? (' - ' + defaultDescription) : '' }`;
</script>

<svelte:head>
	<title>{ pageTitle }</title>
	<meta name="description" content={ pageDescription } />
	<meta property="og:title" content={ pageTitle } />
	<meta property="og:description" content={ pageDescription } />
	<meta property="og:site_name" content={ defaultName } />
	<meta property="og:url" content={ $page.url.href } />
	<meta property="og:type" content={ defaultType } />
	<meta property="og:locale" content={ defaultLocale } />
	<meta name="twitter:card" content={ card } />
	<meta name="twitter:site" content={ twitterAccount } />
	<meta name="twitter:title" content={ pageTitle } />
	<meta name="twitter:description" content={ pageDescription } />
	{#if image}
		<meta property="og:image" content={ image } />
		<meta property="og:image:width" content={ `${ width }` } />
		<meta property="og:image:height" content={ `${ height }` } />
		<meta property="og:image:alt" content={ alt } />
		<meta name="twitter:image" content={ image } />
		<meta name="twitter:image:alt" content={ alt } />
	{/if}
</svelte:head>
