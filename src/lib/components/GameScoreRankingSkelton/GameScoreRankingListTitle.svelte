<script lang="ts">
	export let name='';
	export let isEvent=false;
	export let current=false;
</script>

<div class="flex justify-start items-center py-2 fi-border border-b <lg:px-4">
	{#if isEvent}
		<div class="flex-shrink-0 mr-3 flex items-center">
			{#if current }
				<span class="event-chip fi-border text-white bg-primary-light">
					開催中
				</span>
			{:else}
				<span class="event-chip fi-border text-base-dark bg-opacity-8 bg-base-dark dark:(bg-opacity-8 bg-base-light text-white text-opacity-60)">
					終了
				</span>
			{/if}
		</div>
	{/if}
	<div class="font-bold">
		{ name }
	</div>
</div>

<style>
	.event-chip {
		@apply inline-block w-16 py-0.5 border rounded-2xl text-xs text-center;
	}
</style>