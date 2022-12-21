<script lang="ts">
	import Modal from '$lib/components/Modal';
	import { onDestroy, tick } from 'svelte';
	import { viewport } from '$lib/stores/device';
	import transform from 'lodash/transform';
	import { clipText, trigger } from '$lib/functions/util';

	const assetBase = `${ import.meta.env.asset_endpoint }`;
	const origWidth = 640;
	const origHeight = 720;
	const origRatio = origWidth / origHeight;

	export let active = false;
	export let products = [];
	export let results = [];

	let iframe;
	let childWindow;
	let persistent = true;

	function onLoadIframe() {
		childWindow = iframe.contentWindow;

		const images = results.map(v => productDataMap[v.productId].image);
		const names = results.map(v => productDataMap[v.productId].name);

		childWindow.setData(images, names);
		childWindow.addEventListener('click', startGacha);
		childWindow.addEventListener('confirm', closeSelf);
		childWindow.init();

		renderFrame();
	}

	async function renderFrame() {
		await tick();
		if( !iframe ){
			return;
		}
		const wrapper = iframe.parentNode;
		let scale = wrapper.clientWidth / origWidth;
		let height = wrapper?.clientWidth / origRatio;
		if ( height > wrapper?.clientHeight ) {
			scale = wrapper?.clientHeight / origHeight;
		}
		iframe.style.transform = `scale(${ scale })`;
		iframe.style.borderRadius = `${ 8 / scale }px`;
	}

	function startGacha() {
		persistent = false;
		childWindow.removeEventListener('click', startGacha);
		childWindow.start();
	}

	function closeSelf() {
		active = false;
		persistent = true;
		updateGameItem();
	}

	function updateGameItem() {
		// GameItemListでの表示を更新
		trigger('gameitem-update');
	}

	onDestroy(() => {
		if(childWindow) {
			childWindow.removeEventListener('click', startGacha);
			childWindow.removeEventListener('confirm', closeSelf);
		}
	});

	$: if($viewport) {
		renderFrame();
	}

	$: productDataMap = transform(products, (r, v) => {
		r[v.productId] = {
			name: clipText(v.name, 18, 0, '…'),
			image: v.thumbnailUrl
		};
	}, {});

</script>

<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal
	persistent={persistent}
	rounded="none"
	class="gacha-anime-wrapper bg-opacity-0 w-full h-full max-w-640px max-h-720px"
	frameClass="overflow-hidden"
	innerClass="h-full"
	closeable={false}
	closeWithNavigate={false}
	bind:active={active}
	on:close={updateGameItem}
>
	<iframe
		title="fingger"
		bind:this={iframe}
		on:load={onLoadIframe}
		class="absolute top-1/2 left-1/2 w-full h-full origin-center w-640px h-720px -ml-320px -mt-360px rounded-lg"
		src="/assets/animes/gacha/index.html"
	></iframe>
</Modal>

<style lang="scss">
	:global(.gacha-anime-wrapper),
	:global(.gacha-anime-wrapper > div) {
		overflow: hidden;
	}
</style>