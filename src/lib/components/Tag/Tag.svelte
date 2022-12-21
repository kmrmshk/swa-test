<script lang="ts">
	export let mode = 'normal';
	export let closeable = false;
	export let disabled = false;

	const defaults = 'relative text-xs rounded-full px-3 py-0.5 inline-block cursor-pointer';

	function modeClass(m:string){
		switch(m){
			case 'selected':
				return `selected border border-width-2 border-primary-light text-primary-light dark:(border-primary-dark text-primary-dark) font-bold`;
			case 'unselected':
				return 'unselected border border-width-2 border-gray-500 fi-text-sub font-bold';
			case 'search':
				return 'search bg-primary-light text-white';
			default:
				return 'normal text-base-dark';
		}
	}

	$: classes = `tag ${defaults} ${modeClass(mode)}`;
</script>

<span on:click class="{classes} {$$props.class || ''}" class:disabled>
	<slot />
	{#if closeable}
			<i class="icon fingger-close text-xxs ml-0.5" />
	{/if}
</span>

<style lang="scss">
	.tag::before {
		content: '';
		@apply absolute top-0 bottom-0 left-0 right-0 pointer-events-none transition-colors box-border rounded-full;
	}
	.normal{
		background-color: #E3E4E5;
	}
	.normal:hover::before{
		@apply bg-black bg-opacity-16;
	}
	.selected:hover::before{
		@apply bg-primary-light bg-opacity-12;
	}
	.unselected:hover::before{
		@apply bg-black bg-opacity-16;
	}
	.search:hover::before{
		@apply bg-white bg-opacity-38;
	}
	:global(.dark) .unselected:hover::before{
		@apply bg-white bg-opacity-16;
	}
	.disabled{
		@apply opacity-60 cursor-default;
	}
</style>