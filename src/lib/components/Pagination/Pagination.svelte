<script>
	import { createEventDispatcher } from 'svelte';
	import clamp from 'lodash/clamp';
	import Button from '$lib/components/Button';

	export let radius = 2;
	export let index = 0;
	export let total = 0;

	const first = 0;
	const dispatch = createEventDispatcher();

	function isMatched(p) {
		return p === current;
	}
	function toTextClass(p = null) {
		return isMatched(p)
			? 'text-primary-light dark:text-primary-dark'
			: 'text-base-dark text-opacity-60 dark:(text-white text-opacity-60)';
	}

	function onSelect(p) {
		index = p;
		dispatch('select', p);
	}

	$: last = total - 1;
	$: spilling = total > radius * 2 + 1;
	$: current = clamp(index, first, last);
	$: hasPrev = current > 0;
	$: hasNext = current < last;
	$: items = Array(total).fill(null).map((v, i) => i);
	$: targets = (current - radius) < first ? items.slice(first, Math.min(total, first + (radius * 2) + 1))
		: (current + radius) > last ? items.slice(Math.max(first, total - (radius * 2 + 1)), total)
		: items.slice(Math.max(first, current - radius), Math.min(total, current + radius + 1));
</script>

<nav class="flex items-center content-center { $$props.class || '' }">
	<Button class="p-2 rounded-none" nogutters text disabled={ !hasPrev } on:click={ () => onSelect(current - 1) }>
		<i class="icon fingger-arrow-left { hasPrev && toTextClass() } text-xl" />
	</Button>
	{#if spilling}
		{#if current - radius > first}
			<Button nogutters text
				class="mx-1 px-3 py-2 rounded-none { isMatched(first) ? 'pointer-events-none' : '' }"
				on:click={ () => onSelect(first) }>
				<span class="text-sm { toTextClass(first) }">{ first + 1 }</span>
			</Button>
		{/if}
		{#if current - radius > first + 1}
			<span class="text-sm { toTextClass() }">...</span>
		{/if}
	{/if}
	{#if total > 0}
		{#each targets as item}
			<Button nogutters text
				class="mx-1 px-3 py-2 rounded-none { isMatched(item) ? 'pointer-events-none' : '' }"
				on:click={ () => onSelect(item) }>
				<span class="text-sm { toTextClass(item) }">{ item + 1 }</span>
			</Button>
		{/each}
	{:else}
		<Button class="mx-1 px-3 py-2 rounded-none pointer-events-none" nogutters text disabled>
			<span class="text-sm { toTextClass(first) }">1</span>
		</Button>
	{/if}
	{#if spilling}
		{#if current + radius < last - 1}
			<span class="text-sm { toTextClass() }">...</span>
		{/if}
		{#if current + radius < last}
			<Button nogutters text
				class="mx-1 px-3 py-2 rounded-none { isMatched(last) ? 'pointer-events-none' : '' }"
				on:click={ () => onSelect(last) }>
				<span class="text-sm { toTextClass(last) }">{ total }</span>
			</Button>
		{/if}
	{/if}
	<Button class="p-2 rounded-none" nogutters text disabled={ !hasNext } on:click={ () => onSelect(current + 1) }>
		<i class="icon fingger-arrow-right { hasNext && toTextClass() } text-xl" />
	</Button>
</nav>