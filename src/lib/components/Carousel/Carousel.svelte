<script lang="ts">
	import { goto } from '$app/navigation';
	import { Autoplay, Grid } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import range from 'lodash/range';
	import get from 'lodash/get';
	import { viewport } from '$lib/stores/device';
	import Card from '$lib/components/Card';
	import Bullet from './Bullet.svelte';

	export let list = [];
	export let slidesPerView = 1;
	export let slidesPerGroup = 1;
	export let slidesPerColumn = 1;
	export let slidesPerColumnFill = 'row';
	export let breakpoints = null;
	export let gap = 0;
	export let loop = false;
	export let autoHeight = false;
	export let useDummy = false;
	export let offsetBefore = 0;
	export let offsetAfter = 0;
	export let autoMode = false;
	export let useGridStyle = false;

	let swiper:Swiper;
	let selectedIndex = 0;
	let itemsNumX = 1;
	let itemsNumY = 1;
	let gridColNums = 1;

	export function refresh() {
		onChangedIndex();
		onChangedBreakpoints();
		swiper?.update();
		swiper?.updateSize();
		swiper?.updateSlides();
	}

	function onChangedIndex() {
		if(!swiper) {
			return;
		}
		if (loop) {
			selectedIndex = swiper?.realIndex ?? 0;
		}
		else {
			selectedIndex = swiper?.activeIndex / swiper?.params.slidesPerGroup;
		}
	}

	function onChangedBreakpoints() {
		if(!swiper) {
			return;
		}
		itemsNumX = swiper?.params.slidesPerView;
		itemsNumY = slidesPerColumn;
	}

	function onClickedBullet(index) {
		if (loop) {
			swiper?.slideToLoop(index);
		}
		else {
			swiper?.slideTo(index * swiper?.params.slidesPerGroup);
		}
	}

	function onClickedItem() {
		const index = swiper?.realIndex;
		const href = String(get(dirtyItems, `[${ index }].href`, ''));
		if(!href) {
			return;
		}
		if(href.match(/^https?.*$/)) {
			window.open(href, '_blank');
		} else {
			goto(href);
		}
	}

	function getModules() {
		const modules = [];
		if(autoMode) {
			modules.push(Autoplay);
		}
		if(slidesPerColumn > 1) {
			modules.push(Grid);
		}
		return modules;
	}

	function getModuleOptions() {
		const options = {};
		if(autoMode) {
			options['autoplay'] = {
				delay: 5000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			};
		}
		if(slidesPerColumn > 1) {
			options['grid'] = {
				rows: slidesPerColumn,
				fill: slidesPerColumnFill
			};
		}
		return options;
	}
	$: if (swiper) {
		setTimeout(refresh, 0);
	}
	$: if (swiper && $viewport) {
		refresh();
	}
	$: length = list.length;
	$: cellNums = itemsNumX * itemsNumY;
	$: pageNums = Math.floor(length / cellNums) + ((length % cellNums > 0) ? 1 : 0);
	$: gridColNums = itemsNumX * ( pageNums ? pageNums : 1 );
	$: paginations = range(pageNums);
	$: dirtyItems = useDummy
		? (pageNums > 0
				? range(pageNums * cellNums).map(i => list[i] || null)
				: new Array(cellNums).fill(null)
		)
		: list;
	$: swiperProps = {
		class: (slidesPerColumn > 1) && 'multi-row',
		loop: loop,
		effect: "fade",
		spaceBetween: gap,
		slidesPerGroup: slidesPerGroup,
		slidesPerView: slidesPerView,
		slidesOffsetBefore: offsetBefore,
		slidesOffsetAfter: offsetAfter,
		breakpoints: breakpoints,
		autoHeight: autoHeight,
		resizeObserver: true,
		preloadImages: true,
		modules: getModules(),
		...(getModuleOptions())
	};
</script>

<section class="relative" class:swiper-grid-style={useGridStyle} style="--grid-col-nums:{gridColNums};">
	<Swiper
		{ ...swiperProps }
		on:swiper={ e => swiper = e.detail[0] }
		on:breakpoint={ onChangedBreakpoints }
		on:realIndexChange={ onChangedIndex }
		on:tap={ onClickedItem }
	>
		{#each dirtyItems as item, index}
			<SwiperSlide>
				<slot name="slide" { item } { index }>
					<!-- NOTE: loop有効時のコピーデータは再生成されない。scriptではなくcssで切り替える -->
					<Card
						class="aspect-w-2 md:hidden aspect-h-1 min-w-full bg-center bg-no-repeat bg-cover { item.href ? 'cursor-pointer' : '' }"
						style={`background-image: url(${ item.sm });`}>
					</Card>
					<Card
						class="aspect-w-4 <md:hidden aspect-h-1 min-w-full bg-center bg-no-repeat bg-cover { item.href ? 'cursor-pointer' : '' }"
						style={`background-image: url(${ item.lg });`}>
					</Card>
				</slot>
			</SwiperSlide>
		{/each}
	</Swiper>

	<nav on:click={() => swiper?.slidePrev()} class="<md:hidden fi-text-sub absolute inline-flex items-center top-0 -left-4 w-4 h-full">
		<i class="icon fingger-arrow-left"/>
	</nav>
	<nav on:click={() => swiper?.slideNext()} class="<md:hidden fi-text-sub absolute inline-flex items-center top-0 -right-4 w-4 h-full">
		<i class="icon fingger-arrow-right"/>
	</nav>
</section>
<nav class="flex items-center justify-center my-2 md:my-3">
	{#each paginations as index}
		<Bullet class="mx-2" active={index === selectedIndex} on:click={() => onClickedBullet(index)}/>
	{/each}
</nav>

<style>
	:global(.multi-row .swiper-wrapper) {
			height: auto !important;
	}
	.swiper-grid-style :global(.swiper-grid .swiper-wrapper){
			@apply grid;
			grid-template-columns: repeat(var(--grid-col-nums), minmax(0, 1fr));
	}
</style>
