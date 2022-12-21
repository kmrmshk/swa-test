<script lang="ts">
    import Chip from '$lib/components/Chip';
	export let minimum = false;
</script>

<!-- NOTE: 「公式」の文言が改行されることがあるため、pr-0 を最後に挿入 -->
<Chip class="{minimum ? 'w-20px h-20px pl-0 justify-center' : 'w-60px'} {$$props.class || ''} pr-0" icon="star" size="sm" text="yellow-300" color="teal-600">
	{#if !minimum}
		<span class="text-xs text-white" class:ml-1.5={!minimum}>公式</span>
	{/if}
</Chip>