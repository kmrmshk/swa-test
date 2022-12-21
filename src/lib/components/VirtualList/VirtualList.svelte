<script>
	import { onMount, tick, createEventDispatcher } from 'svelte';

	// props
	export let items = [];
	export let height = '100%';
	export let itemHeight = undefined;
	export let autoScroll = false;

	// read-only, but visible to consumers via bind:start
	export let start = 0;
	export let end = 0;
	export let customLoopKeyName = '';

	const dispatch = createEventDispatcher();

	// local state
	let heightMap = [];
	let rows;
	let viewport;
	let contents;
	let viewportHeight = 0;
	let visible;
	let mounted;
	let grabbing = false;

	let top = 0;
	let bottom = 0;
	let averageHeight;

	$: visible = items
		.slice(start, end)
		.map((data, i) => {
			let index = i + start;
			if (customLoopKeyName !== '' && data[customLoopKeyName]) {
				index = data[customLoopKeyName];
			}
			return {index: index, data};
		});

	// whenever `items` changes, invalidate the current heightmap
	$: if (mounted) {
		refresh(items, viewportHeight, itemHeight);
	}

	async function refresh(items, viewportHeight, itemHeight) {
		const isStartOverflow = items.length < start;
		if (isStartOverflow) {
			await scrollToIndex(items.length - 1, { behavior: 'auto' })
		}
		const { scrollTop } = viewport;
		await tick(); // wait until the DOM is up to date
		let contentHeight = top - scrollTop;
		let i = start;
		while (contentHeight < viewportHeight && i < items.length) {
			let row = rows[i - start];
			if (!row) {
				end = i + 1;
				await tick(); // render the newly visible row
				row = rows[i - start];
			}
			const rowHeight = (heightMap[i] = itemHeight || row.offsetHeight);
			contentHeight += rowHeight;
			i += 1;
		}
		end = i;
		const remaining = items.length - end;
		averageHeight = (top + contentHeight) / end;
		bottom = remaining * averageHeight;
		heightMap.length = items.length;

		if(autoScroll && !grabbing) {
			await tick();
			scrollBottom();
		}
	}

	async function handleScroll(event) {
		const { scrollTop, clientHeight, scrollHeight } = viewport;

		if (scrollTop === 0) {
			dispatch('scrollTop');
		} else if (Math.round(scrollTop + clientHeight + 1) >= scrollHeight) {
			dispatch('scrollBottom');
		}

		const oldStart = start;
		for (let v = 0; v < rows.length; v += 1) {
			heightMap[start + v] = itemHeight || rows[v].offsetHeight;
		}
		let i = 0;
		let y = 0;
		while (i < items.length) {
			const rowHeight = heightMap[i] || averageHeight;
			if (y + rowHeight > scrollTop) {
				start = i;
				top = y;
				break;
			}
			y += rowHeight;
			i += 1;
		}
		while (i < items.length) {
			y += heightMap[i] || averageHeight;
			i += 1;
			if (y > scrollTop + viewportHeight) {
				break;
			}
		}
		end = i;

		const remaining = items.length - end;
		averageHeight = y / end;
		while (i < items.length) {
			heightMap[i++] = averageHeight;
		}
		bottom = remaining * averageHeight;

		// prevent jumping if we scrolled up into unknown territory
		if (start < oldStart) {
			await tick();
			let expectedHeight = 0;
			let actualHeight = 0;
			for (let i = start; i < oldStart; i += 1) {
				if (rows[i - start]) {
					expectedHeight += heightMap[i];
					actualHeight += itemHeight || rows[i - start].offsetHeight;
				}
			}
			const d = actualHeight - expectedHeight;
			viewport.scrollTo(0, scrollTop + d);
		}
		dispatch('scroll', event);
	}

	export function getViewport() {
		return viewport;
	}

	export function scrollTop(options) {
		viewport.scrollTo({
			left: 0,
			top: 0,
			behavior: 'instant',
			...options
		});
	}

	export function scrollBottom(options) {
		const { scrollHeight, clientHeight } = viewport;
		viewport.scrollTo({
			left: 0,
			top: scrollHeight - clientHeight,
			behavior: 'instant',
			...options
		})
	}

	export async function scrollToIndex (index, options) {
		const { scrollTop } = viewport;
		const distance = (index - start) * (itemHeight || averageHeight);
		viewport.scrollTo({
			left: 0,
			top: scrollTop + distance,
			behavior: 'instant',
			...options
		});
	}

	// trigger initial refresh
	onMount(() => {
		rows = contents.getElementsByTagName('svelte-virtual-list-row');
		mounted = true;
	});
</script>

<svelte-virtual-list-viewport
	bind:this={viewport}
	bind:offsetHeight={viewportHeight}
	class="{ $$props.class || '' }"
	style="height: {height};"
	on:scroll={ handleScroll }
	on:touchstart={ () => grabbing = true }
	on:mousedown={ () => grabbing = true }
	on:touchend={ () => grabbing = false }
	on:mouseup={ () => grabbing = false }
	on:touchstart
	on:touchmove
	on:touchend
	on:mousedown
	on:mousemove
	on:mouseup
	on:mousewheel
>
	<slot name="header"/>
	<svelte-virtual-list-contents
		bind:this={ contents }
		style="padding-top: { top }px; padding-bottom: { bottom }px;"
	>
		{#each visible as row (row.index) }
			<svelte-virtual-list-row>
				<slot item={ row.data } index={ row.index }>Missing template</slot>
			</svelte-virtual-list-row>
		{/each}
		<slot name="footer"/>
	</svelte-virtual-list-contents>
</svelte-virtual-list-viewport>

<style>
    svelte-virtual-list-viewport {
        position: relative;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: block;
    }
    svelte-virtual-list-contents, svelte-virtual-list-row {
        display: block;
    }
    svelte-virtual-list-row {
	    overflow: hidden;
    }
</style>