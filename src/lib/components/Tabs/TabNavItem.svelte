<script lang='ts'>
	import { mobile } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import { SwiperSlide } from 'swiper/svelte';
	import { getContext } from 'svelte';
	import { tabsContext } from './Tabs.svelte';

	export let shrink = false;
	export let value:number|string|null = null;
	export let path:string|RegExp|null = null;

	const small = smaller('sm');
	const tab = {
		path: path,
		value: value,
	};
	const {
		registerTab,
		selectTab,
		selectedTab,
		secondary,
		segmented,
		useSwiper,
	} = getContext(tabsContext);

	registerTab(tab);

	const base = ['relative text-sm select-none focus:outline-none items-center justify-center transition-colors duration-50'];

	function font() {
		switch (true) {
			case secondary:
				return ['fi-text-sub text-primary-light font-bold'];
			case segmented:
				return ['fi-text-sub font-bold'];
			default:
				return ['fi-text-sub font-bold'];
		}
	}

	function space() {
		switch (true) {
			case secondary:
				return ['min-w-35 h-9 py-2 px-4'];
			case segmented:
				return ['px-6 md:px-8 md:w-min-34 h-7.5'];
			default:
				return ['p-4 h-12'];
		}
	}

	function design() {
		switch (true) {
			case secondary:
				return ['border-base-dark border-opacity-10 dark:(border-white border-opacity-10) border-1 border-solid rounded-5xl'];
			case segmented:
				return ['rounded-lg'];
			default:
				return ['bg-transparent border-solid border-b-3 border-primary-light border-opacity-0 dark:(border-primary-dark border-opacity-0)'];
		}
	}

	$: classes = [
		...((shrink || $mobile || $small)
				? ['inline-flex']
				: ['block w-40']
		),
		...base,
		...font(),
		...space(),
		...design(),
	].join(' ');

	function onClicked() {
		selectTab(tab);
	}
</script>

{#if $useSwiper}
	<SwiperSlide>
		<button
			class="{ classes } { $$props.class || '' }"
			class:selected={ $selectedTab === tab }
			class:primary={ !secondary && !segmented }
			class:secondary={ secondary }
			class:segmented={ segmented }
			class:dark={ $dark }
			on:click
			on:click={ onClicked }>
			<slot/>
		</button>
	</SwiperSlide>
{:else}
	<button
		class="{ classes } { $$props.class || '' }"
		class:selected={$selectedTab === tab }
		class:primary={!secondary && !segmented }
		class:secondary={secondary }
		class:segmented={segmented }
		class:dark={ $dark }
		on:click
		on:click={ onClicked }>
		<slot/>
	</button>
{/if}

<style>
    /* 通常タブ */
    button.primary.selected {
        @apply border-primary-light text-primary-light text-opacity-100;
    }

    button.dark.primary.selected {
        @apply border-primary-dark text-primary-dark text-opacity-100;
    }

    /* セカンダリデザインタブ */
    button.secondary.selected {
        @apply bg-primary-light text-primary-light bg-opacity-10;
    }

    button.dark.secondary.selected {
        @apply bg-primary-dark text-primary-dark bg-opacity-10;
    }

    button.secondary:not(:first-child) {
        @apply ml-3;
    }

    /* セグメントデザインタブ */
    button.segmented.selected {
        @apply bg-base-dark bg-opacity-8 fi-text;
    }

    button.dark.segmented.selected {
        @apply bg-white bg-opacity-8 fi-text;
    }

    :global(.segmented .swiper-slide:not(:first-child)::before) {
        content: '';
        @apply absolute -left-1px mt-5px w-1px h-20px;
        @apply bg-base-dark bg-opacity-10;
    }

    :global(.segmented.dark .swiper-slide:not(:first-child)::before) {
        @apply bg-white bg-opacity-10;
    }

    button.segmented:not(:first-child)::before {
        content: '';
        @apply absolute -left-1px mt-0 w-1px h-20px;
        @apply bg-base-dark bg-opacity-10;
    }

    button.segmented.dark:not(:first-child)::before {
        @apply bg-white bg-opacity-10;
    }
</style>