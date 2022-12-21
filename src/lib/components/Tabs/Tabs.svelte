<script context="module">
	export const tabsContext = {};
</script>

<script lang='ts'>
	import { page } from '$app/stores';
	import { setContext, onDestroy, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { smaller } from '$lib/stores/breakpoint';
	import isEqual from 'lodash/isEqual';
	import isNull from 'lodash/isNull';
	import find from 'lodash/find';
	import debounce from 'lodash/debounce';

	export let value:number|string|null = null;
	export let secondary = false;
	export let segmented = false;
	export let swipe = false;
	export let shrink = false;

	const small = smaller('sm');
	const dispatch = createEventDispatcher();
	const tabs = [];
	const panels = [];
	const selectedTab = writable(null);
	const selectedPanel = writable(null);
	const useSwiper = writable(swipe);

	const registerTab = tab => {
        tabs.push(tab);
        selectedTab.update(current => {
            if((tab.path instanceof String && $page.url === tab.path) || (tab.path instanceof RegExp && tab.path.test(value))) {
                return tab;
            }
            if(value && tab.value && isEqual(value, tab.value)) {
                return tab;
            }
            return current || tab
        });

        onDestroy(() => {
            const i = tabs.indexOf(tab);
            tabs.splice(i, 1);
            selectedTab.update(current => current === tab ? (tabs[i] || tabs[tabs.length - 1]) : current);
        });
    };

	const registerPanel = panel => {
        panels.push(panel);
        selectedPanel.update(current => {
            if((panel.path instanceof String && $page.url === panel.path) || (panel.path instanceof RegExp && panel.path.test(value))) {
                return panel;
            }
            if(value && panel.value && isEqual(value, panel.value)) {
                return panel;
            }
            return current || panel
        });

        onDestroy(() => {
            const i = panels.indexOf(panel);
            panels.splice(i, 1);
            selectedPanel.update(current => current === panel ? (panels[i] || panels[panels.length - 1]) : current);
        });
    };

	const selectTab = debounce(tab => {
        const i = tabs.indexOf(tab);
        if(!isNull(tab.value)) {
            value = tab.value;
        }
        selectedTab.set(tab);
        selectedPanel.set(panels[i]);
        dispatch('select', i);
    }, 100, {leading: true, trailing: false});

    const selectTabByValue = targetValue => {
	    const targetTab = find(tabs, item => {
	        return item.path === targetValue
                || item.value === targetValue
                || (item.path instanceof RegExp && item.path.test(targetValue));
        });
	    if(targetTab) {
	        selectTab(targetTab);
        }
    };

	setContext(tabsContext, {
		registerTab,
		registerPanel,
		selectTab,
		selectTabByValue,
		secondary,
		segmented,
		useSwiper,
		selectedTab,
		selectedPanel
	});

	$: {
		useSwiper.update(() => swipe);
		if(value) {
			selectTabByValue(value);
		}
	}
</script>

<div
    class="fi-tabs w-full sm:w-auto {$$props.class || ''}"
    class:inline-flex={ $small && shrink && segmented }
>
    <slot secondary={secondary} segmented={segmented} />
</div>

<style>
    .fi-tabs {
        @apply w-full md:w-auto;
    }
    /* swiper hack */
	.fi-tabs :global(.swiper-slide) {
		width: auto;
	}
</style>
