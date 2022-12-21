<script lang="ts">
	import { dark } from '$lib/stores/theme';
	import { getContext } from 'svelte';
	import { tabsContext } from './Tabs.svelte';
	import get from 'lodash/get';
	import { Swiper } from 'swiper/svelte';
	import { FreeMode } from 'swiper';

	export let fixed = false;
	export let centered = false;
	export let spaceBetween = 0;
	export let minimum = false;
	export let offsetBefore = 0;
	export let offsetAfter = 0;
	export let swiper:Swiper;

	const context = getContext(tabsContext);

	$: secondary = get(context, 'secondary');
	$: segmented = get(context, 'segmented');
	$: useSwiper = get(context, 'useSwiper');

	$: swiperOptions = {
		spaceBetween: spaceBetween,
		slidesPerView: 'auto',
		virtualTranslate: fixed,
		slidesOffsetBefore: offsetBefore,
		slidesOffsetAfter: offsetAfter,
		centerInsufficientSlides: centered,
		modules: [ FreeMode ],
		freeMode: {
			enable: true,
			freeModeMinimumVelocity: 0.2,
			freeModeMomentum: true,
		},
	}
</script>

{#if $useSwiper || minimum }
	<Swiper
		on:swiper={ e => swiper = e.detail[0] }
		class="{ $dark ? 'dark' : '' } { segmented ? 'segmented' : '' }"
		{ ...swiperOptions }
	>
		<slot />
	</Swiper>
{:else}
	<ul
		class:primary={ !secondary && !segmented }
		class:secondary={ secondary }
		class:segmented={ segmented }
		class:dark={ $dark }
		style={ `padding-left: ${ offsetBefore }px; padding-right: ${ offsetAfter }px;` }
		class="items-center justify-items-center { $$props.class || '' }">
		<slot />
	</ul>
{/if}

<style>
	:global(.swiper.segmented) {
		@apply flex md:w-auto border border-1 rounded-lg;
		@apply border-base-dark border-opacity-12;
	}
	:global(.swiper.dark.segmented) {
		@apply border-white border-opacity-12;
	}

	ul.primary,
	ul.secondary {
		@apply flex flex-row;
	}

	ul.segmented {
		@apply flex inline-flex md:w-auto border border-1 rounded-lg;
		@apply border-base-dark border-opacity-12;
	}
	ul.segmented.dark {
		@apply border-white border-opacity-12;
	}
</style>