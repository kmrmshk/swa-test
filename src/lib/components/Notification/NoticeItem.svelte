<script lang="ts">
	import { goto } from '$app/navigation';

	import Badge from '$lib/components/Badge';

	export let unread = true;
	export let to = '';
	export let title = '';
	export let overview = '';
	export let datetime = '';

	function onClickNotification() {
		if(to.length) {
			goto(to);
		}
	}
</script>

<li class="flex justify-between items-start relative w-full px-4 md:px-6 py-4 transition-colors cursor-pointer hover:bg-base-dark hover:bg-opacity-4 dark:hover:bg-white dark:hover:bg-opacity-4"
	on:click={ onClickNotification }>
	<div class="relative flex-shrink-0 flex-grow-0 mr-2">
		{#if unread}
			<Badge top left class="w-5 h-5 -left-2 -top-1"/>
		{/if}
	</div>
	<div class="flex flex-1 flex-col md:flex-row md:flex-wrap pl-5 content-around items-start justify-around flex-grow">
		<h4 class="order-1 flex-1 text-base-dark text-sm font-bold">
			{ title }
		</h4>
		<h5 class="order-2 md:order-3 w-full mt-1 text-sm line-clamp-2">
			{ overview }
		</h5>
		<time class="order-3 md:order-2 w-full md:w-auto md:text-right fi-text-sub text-xs md:top-4 md:right-6">
			{ datetime }
		</time>
	</div>
</li>