<script lang="ts">
	import Card from '$lib/components/Card';
	import Avatar from '$lib/components/Avatar';

	export let asEmpty = false;
	export let name = '';
	export let description = '';
	export let amount = 0;
	export let thumbnail = '/assets/images/icons/avatar.svg';
</script>

{#if asEmpty}
	<Card class="h-full min-h-142px rounded-lg overflow-hidden border-base-dark border-opacity-10 dark:(border-white border-opacity-12) border-1">
		<div class="flex items-center justify-center min-w-full h-full text-sm text-base-dark text-opacity-30 dark:(text-white text-opacity-38)">
			No Item
		</div>
	</Card>
{:else}
	<Card class="h-full fi-border bg-white dark:bg-gray-900 flex-row border-1 rounded-lg shadow-02dp">
		<div class="flex items-end justify-start px-4 pt-4">
			<Avatar {thumbnail} size="56" rounded="lg" />
			<div class="pl-3">
				<h4>{name}</h4>
				<h5 class="align-bottom">
					<span class="fi-text-sub text-xs md:text-sm">所持数</span>
					<span class="fi-text ml-3 text-base">×{ amount }</span>
				</h5>
			</div>
		</div>
		<hr class="fi-border mx-2 mt-3 border-t-1" />
		<p class="px-4 py-3 text-xs">
			{@html description}
		</p>
	</Card>
{/if}