<script lang="ts">
	import type { PageData } from './$types';
	import Metatags from '$lib/components/Metatags';
	import GachaBox from '$lib/components/GachaBox';
	import GameItemList from '$lib/components/GameItemList';
	import { smaller } from '$lib/stores/breakpoint';

	const small = smaller('sm');
	const gachaBreakpoints = {
		0: { slidesPerView: 3, slidesPerGroup: 3 },
	};
	const itemSlidesPerColumn = 2;
	const itemBreakpoints = {
		768: { slidesPerView: 2, slidesPerGroup: 2, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
		1132: { slidesPerView: 3, slidesPerGroup: 3, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
	};

	export let data:PageData;
	let bundleInfo = data.bundleInfo;
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ bundleInfo?.title } | ガチャ"
	description="{ bundleInfo?.title } | ガチャ"
/>
<section class="p-6 md:(p-6 pt-7 pr-8) m-auto max-w-1132px">
	<h5 class="pb-1 md:(pb-2 pl-2 text-xl font-bold)">ガチャ</h5>
	<GachaBox bundleId={bundleInfo?.bundleId} breakpoints={gachaBreakpoints} />
	<h5 class="pt-6 pb-1 md:(pb-2 pl-2 text-xl font-bold)">アイテム</h5>
	<GameItemList
		bundleId={bundleInfo?.bundleId}
		breakpoints={itemBreakpoints}
		asCarousel={!$small}
		slidesPerColumn={ itemSlidesPerColumn }
	/>
</section>
