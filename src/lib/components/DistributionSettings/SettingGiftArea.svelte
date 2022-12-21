<script lang="ts">
	import Switch from '$lib/components/Switch';

	export let isGameStart = false;
	export let gameGiftEnable = false;
	export let isGiftEnable = false;
	export let isGiftEffectEnable = false;

	function onChangedGiftEnable(){
		isGiftEffectEnable = isGiftEnable;
	}
</script>
<div class="{$$props.class || ''}">
	<div class="py-3 px-3 md:px-6">
		{#if isGameStart}
			ギフト設定を選択してください。
		{:else}
			ギフト設定
		{/if}
	</div>
	<hr>
	<div class="py-3 px-3 md:px-6 flex items-center justify-center">
		<div class="flex-grow" class:opacity-40={ ! gameGiftEnable }>
			<span class="text-sm font-bold mr-2">ギフト機能</span>
			<span class="opacity-80 text-xs <md:block">有効にすることで視聴者がギフトを贈ることができます</span>
		</div>
		<Switch bind:checked={ isGiftEnable } on:change={onChangedGiftEnable} disabled={ ! gameGiftEnable } />
	</div>
	<hr>
	<div class="py-3 px-3 md:px-6 flex items-center justify-center">
		<div class="flex-grow" class:opacity-40={ ! gameGiftEnable || ! isGiftEnable }>
			<span class="text-sm font-bold mr-2">ギフト演出</span>
			<span class="opacity-80 text-xs <md:block">有効にすることでコンテンツ画面のギフト演出が表示されます</span>
		</div>
		<Switch bind:checked={ isGiftEffectEnable } disabled={ ! gameGiftEnable || ! isGiftEnable } />
	</div>
	<hr>
</div>