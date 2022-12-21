<script lang="ts">
	import Card from '$lib/components/Card';

	export let asEmpty = false;
	export let name = '';
	export let amount = 0;
	export let thumbnail = '/assets/images/icons/avatar.svg';
</script>

{#if asEmpty}
	<Card rounded="lg" class="overflow-hidden border-base-dark border-opacity-10 dark:(border-white border-opacity-12) border-1">
		<div class="flex items-center justify-center min-w-full h-16 text-sm text-base-dark text-opacity-30 dark:(text-white text-opacity-38)">
			No Item
		</div>
	</Card>
{:else}
	<Card on:click rounded="lg" class="overflow-hidden shadow-01dp transition cursor-pointer transform origin-top hover:(shadow-04dp scale-101)">
		<div class="flex items-center min-w-full h-16 bg-white dark:bg-opacity-10">
			<div class="bg-base-dark w-16 h-16 flex-shrink-0 bg-contain bg-center"
				style="{`background-image: url(${thumbnail});`}"></div>
			<div class="p-2 relative text-sm">
				<span class="fi-text body-2 line-clamp-2 font-bold">{ name }</span>
				<span class="fi-text-sub">×{ amount }</span>
			</div>
		</div>
	</Card>
{/if}