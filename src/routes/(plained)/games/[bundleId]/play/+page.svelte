<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import get from 'lodash/get';

	import Metatags from '$lib/components/Metatags';
	import Snackbar from '$lib/components/Snackbar';

	import { dark } from '$lib/stores/theme';
	import { viewport, ios, android } from '$lib/stores/device';
	import { LoadingAnime } from '$lib/components/GamePlay';

	import { tab } from '$lib/functions/network';
	import { getAuthTokens, setHeaders } from '$lib/services/auth';
	import { ContentServerApi } from '$lib/apis';

	const origin = $page.url.origin;
	const basePath = import.meta.env.game_endpoint || '';
	const envName = import.meta.env.platform_environment || '';
	const apiBase = import.meta.env.backend_endpoint || '';
	const buildDir = 'Build';
	const defaultWidth = 1280;
	const defaultHeight = 720;

	let initialized = false;
	let extensible = false;
	let inLoading = true;

	let unityInstance:any;
	let canvas:HTMLCanvasElement|null = null;
	let snackbar:Snackbar;

	let delayTimeoutId = -1;
	let messageTimeoutId = -1;

	let buildBasePath = '';
	let loaderFilePath = '';
	let unityOptions = {};
	let additionalScripts:Array<string> = [];

	let title = '';
	let bundleId:string;
	let distributionUuid:string;
	let progressRate = '0%';
	let receivedMessage = false;
	let forcedClosing = false;

	let screenWidth = defaultWidth;
	let screenHeight = defaultHeight;
	let soloMode:boolean;

	let idToken:string;
	let accessToken:string;
	let contentServerToken:string;

	$: screenRatio = screenWidth / screenHeight;
	$: canvasScale = ($viewport.width / screenRatio) > $viewport.height
		? $viewport.height / screenHeight
		: $viewport.width / screenWidth;

	function setMessage(m, t = 10000) {
		snackbar?.push(m, t);
	}

	async function setupByGameInfo(info:any) {
		const version = get(info, 'version');
		const settings = get(info, 'gameWebGlSettings');
		const retainedMemory = get(settings, 'totalMemorySize');
		title = get(info, 'title', '');
		buildBasePath = `${basePath}/${bundleId}/${buildDir}`;
		loaderFilePath = `${buildBasePath}/${bundleId}.loader.js?${version}`;
		unityOptions = {
			...( !!retainedMemory
				? { TOTAL_MEMORY: retainedMemory * 1024 * 1024 }
				: null
			),
			dataUrl: `${buildBasePath}/${bundleId}.data.unityweb?${version}`,
			frameworkUrl: `${buildBasePath}/${bundleId}.framework.js.unityweb?${version}`,
			codeUrl: `${buildBasePath}/${bundleId}.wasm.unityweb?${version}`,
		};
		screenWidth = get(settings, 'screenSizeWidth', defaultWidth);
		screenHeight = get(settings, 'screenSizeHeight', defaultHeight);
		additionalScripts = get(settings, 'additionalScriptFiles');
		initialized = true;
	}

	function closeWindow(forced = false) {
		forcedClosing = forced;
		window.opener && window.close();
	}

	async function onInit() {
		unityInstance = await window.createUnityInstance(canvas, unityOptions, onProgress).catch(setMessage);
		window['fingger'].unityInstance = unityInstance;
		extensible = true;
	}

	function onAxiosError(e) {
		setMessage(e.detail[0].message);
	}

	function onProgress(value) {
		progressRate = (value * 100) + '%';
		if( value === 1 ){
			clearTimeout(delayTimeoutId);
			delayTimeoutId = setTimeout(() => {
				inLoading = false;
			}, 1000);
		}
	}

	function onReceivedMessage(e) {
		if(get(e.data, 'type') === 'PFGameInfo') {
			receivedMessage = true;
			setupByGameInfo(e.data?.info);
			return;
		}

		switch (e.data) {
			// case 'SDKLaunched': break;
			// case 'SDKInitialized': break;
			case 'SDKRequestIsSoloPlayMode ':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetIsSoloPlayMode', soloMode);
				break;
			case 'SDKRequestContentServerToken':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetRequestContentServerToken', contentServerToken);
				break;
			case 'SDKRequestIDToken':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetIDToken', idToken);
				break;
			case 'SDKRequestYouTubeAccessToken':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetYouTubeAccessToken', accessToken);
				break;
			case 'SDKDistributionUuid':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetDistributionUuid', distributionUuid);
				break;
			case 'SDKQuited':
				// NOTE: 現状はウィンドウクローズのみ
				closeWindow();
				break;
			case 'SDKRequestEnv':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetRequestEnv', envName);
				break;
			case 'SDKRequestAPIDomain':
				unityInstance?.SendMessage('FinggerJsBridge', 'SetRequestAPIDomain', apiBase);
				break;
			default:
			//console.warn(`unknown message ${e.data}`);
		}
	}

	function onBeforeUnload(e) {
		if(!forcedClosing) {
			e.returnValue = "ページを離れようとしています。よろしいですか？";
		}
	}

	async function onMessageFromAuth({/*from, */data}) {
		if(!!data.user?.userId) {
			updateAuthentication();
		} else {
			closeWindow();
		}
	}

	async function updateAuthentication() {
		dev && console.log('Attempt sync');
		const result = await getAuthTokens();
		idToken = result?.idToken ?? '';
		accessToken = result?.accessToken ?? '';
		if(!idToken || !accessToken) {
			console.warn('Invalid idToken or accessToken');
		}
		return result;
	}

	onMount(async () => {
		if(!browser) {
			return;
		} else if(!window.opener) {
			goto('/');
		} else if ($ios || $android) {
			closeWindow();
		} else {
			bundleId = $page.params?.bundleId ?? '';
			distributionUuid = $page.url.searchParams.get('distribution') ?? '';
			// TODO: modeタイプを定義
			switch($page.url.searchParams.get('mode')) {
				case '1': soloMode = true; break;
				default:  soloMode = false;
			}
			await updateAuthentication()
				// NOTE: 例外的にここでデフォルトのヘッダをセットして認証トークンが正しく取得できるようにしている
				.then(tokens => setHeaders(tokens))
				.then(_ => ContentServerApi.getApiV1ContentserverToken({bundleId}))
				.then(t => contentServerToken = t);

			tab?.on('refreshed', onMessageFromAuth);
			window['fingger'] = { version: import.meta.env.client_version };
			window.clearTimeout(messageTimeoutId);
			window.addEventListener('message', onReceivedMessage);
			window.addEventListener('beforeunload', onBeforeUnload);
			window.opener.postMessage({ type: 'PFRequestGameInfo' }, origin);
			// ポップアップ時 or リロード時、親ウィンドウから一定時間内にデータ送信がなければ終了する。
			messageTimeoutId = window.setTimeout(() => {
				if( ! receivedMessage ){
					closeWindow(true);
				}
			}, 5000);
		}
	});

	onDestroy(() => {
		if(!browser) {
			return;
		}
		window.removeEventListener('message', onReceivedMessage);
		window.removeEventListener('beforeunload', onBeforeUnload);
		window.clearTimeout(delayTimeoutId);
		window.clearTimeout(messageTimeoutId);
		tab?.off('refreshed', onMessageFromAuth);
	});
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{title}"
	description="{title}"
/>

<!-- NOTE: global error handling for snackbar components -->
<svelte:window on:axios-error={ onAxiosError }/>

<svelte:head>
	{#if initialized}
		<script src="{loaderFilePath}" async on:load={ onInit }></script>
	{/if}
	{#if extensible && additionalScripts}
		{#each additionalScripts as src}
			<script src="{buildBasePath}/{src}" async></script>
		{/each}
	{/if}
</svelte:head>

{#if browser}
	<article id="FinggerGame" class="flex items-center justify-center content-center absolute inset-0 max-w-screen max-h-screen overflow-hidden bg-black">
		<!-- NOTE: #unity-canvas は 2021.3.4f1 対策 -->
		<canvas
			id="unity-canvas"
			bind:this={ canvas }
			style="{ `width: ${ screenWidth * canvasScale }px; height: ${ screenHeight * canvasScale }px;` }"
			class="relative max-w-screen max-h-screen bg-white"
			width={ screenWidth }
			height={ screenHeight }
		></canvas>
		{#if inLoading}
			<div class:dark={ $dark } class="loading flex items-center justify-center absolute inset-0 z-50 pointer-events-none bg-base-light dark:bg-gray-800">
				<div class="w-50">
					<LoadingAnime/>
					<div class="mt-10 w-full h-12px border border-gray-400 rounded-full bg-gray-400">
						<div class="h-10px rounded-full bg-base-light" style="width: {progressRate}"></div>
					</div>
				</div>
			</div>
		{/if}
		<Snackbar bind:this={snackbar} bottom center fixed />
	</article>
{/if}