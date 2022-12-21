<script lang="ts">
	import Switch from '$lib/components/Switch';

	export let isGameStart = false;
	export let unlisted = false;
</script>

<div class="{$$props.class || ''}">
	<div class="py-3 px-3 md:px-6">
		{#if isGameStart}
		公開設定を選択してください。
	{:else}
		公開設定
	{/if}
	</div>
	<hr>
	<div class="py-3 px-3 md:px-6 flex items-center justify-center">
		<div class="text-sm flex-grow">
			<span class="font-bold mr-2">限定公開</span>
			<span class="opacity-80 text-xs <md:block">視聴画面のリンクを知っている方のみ視聴可能です</span>
		</div>
		<Switch bind:checked={ unlisted } />
	</div>
	<hr>
</div>